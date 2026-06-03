import { Amplify } from 'aws-amplify';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-south-1_E3WomVcZI';
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID || '7srcfg8usbn4fqe6nlt1rpe6eu';
const region = import.meta.env.VITE_REGION || 'ap-south-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      region,
      loginWith: {
        email: true,
      }
    }
  }
});
