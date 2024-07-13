const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function genKeyPair() {
  
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1" 
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });

  const keysDir = path.join(__dirname, '../../../../libs/keys');

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }

  const publicKeyPath = path.join(keysDir, 'id_rsa_pub.pem');
  const privateKeyPath = path.join(keysDir, 'id_rsa_priv.pem');

  fs.writeFileSync(publicKeyPath, keyPair.publicKey); 
  fs.writeFileSync(privateKeyPath, keyPair.privateKey);
}

genKeyPair();