import * as Ably from 'ably';

// Initialize Ably client
export function getAblyClient() {
  if (!process.env.ABLY_API_KEY) {
    throw new Error('ABLY_API_KEY environment variable is not set');
  }
  
  return new Ably.Realtime(process.env.ABLY_API_KEY);
}

// Create a token request for client-side authentication
export async function createTokenRequest(clientId) {
  if (!process.env.ABLY_API_KEY) {
    throw new Error('ABLY_API_KEY environment variable is not set');
  }
  
  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  
  return new Promise((resolve, reject) => {
    client.auth.createTokenRequest({ clientId: clientId }, null, (err, tokenRequest) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokenRequest);
      }
    });
  });
} 