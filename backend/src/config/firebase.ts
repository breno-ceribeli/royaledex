import admin from 'firebase-admin'

// Valida se a variável existe antes de qualquer coisa
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT environment variable is not defined. ' +
    'Check your .env file or Render environment variables.'
  )
}

// Faz o parse do JSON e trata erro de formato
let serviceAccount: admin.ServiceAccount

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
} catch {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT is not valid JSON. ' +
    'Make sure the entire JSON content is on a single line.'
  )
}

// Inicializa o Admin SDK uma única vez (Singleton)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

console.log('Firebase Admin SDK initialized successfully.')

// Exporta as instâncias para uso em services e middlewares
export const db = admin.firestore()
export const auth = admin.auth()