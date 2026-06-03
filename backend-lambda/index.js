// TouristRegistration Lambda Function
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { ethers } = require('ethers');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const PROFILES_TABLE = 'TouristProfiles';

// Blockchain Configuration (will be set in environment variables)
const RPC_URL = process.env.POLYGON_RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Smart Contract ABI (minimal)
const CONTRACT_ABI = [
  "function registerTourist(string deviceId) public returns (uint256)",
  "function tourists(uint256) public view returns (string deviceId, uint256 timestamp, bool active)"
];

exports.handler = async (event) => {
  console.log('Registration request:', JSON.stringify(event));
  
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    // Validate input
    if (!body.name || !body.phone || !body.deviceId || !body.email) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    
    // Generate tourist ID
    const touristId = `T${Date.now().toString().slice(-8)}`;
    
    // Robust Blockchain Registration with 8-second timeout and fallback
    let blockchainId = `0x_fallback_${Date.now().toString(16)}`;
    try {
      console.log('Registering on blockchain...');
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      
      // Verify private key is available to prevent cryptic crashes
      if (!PRIVATE_KEY || PRIVATE_KEY.length < 10) throw new Error("Invalid or missing PRIVATE_KEY");
      
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
      
      // Execute transaction with strict timeout to prevent API Gateway 502 Bad Gateway
      const txPromise = contract.registerTourist(body.deviceId);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Polygon Amoy RPC Timeout after 8s")), 8000));
      
      const tx = await Promise.race([txPromise, timeoutPromise]);
      console.log('Blockchain transaction submitted successfully:', tx.hash);
      blockchainId = tx.hash;
    } catch (bcError) {
      console.error('Blockchain registration skipped/failed:', bcError.message);
      console.log('Using robust fallback ID to ensure tourist safety registration completes successfully.');
    }
    
    // Save to DynamoDB
    const profile = {
      touristId: touristId,
      name: body.name,
      age: body.age || 0,
      phone: body.phone,
      email: body.email,
      emergencyContact: body.emergencyContact || '',
      emergencyName: body.emergencyName || '',
      deviceId: body.deviceId,
      blockchainId: blockchainId,
      trekDestination: body.trekDestination || '',
      trekStartDate: body.trekStartDate || '',
      trekEndDate: body.trekEndDate || '',
      registrationTime: new Date().toISOString(),
      status: 'active'
    };
    
    await dynamodb.send(new PutCommand({
      TableName: PROFILES_TABLE,
      Item: profile
    }));
    
    console.log('Profile saved:', touristId);
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        touristId: touristId,
        blockchainId: blockchainId,
        message: 'Registration successful'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
