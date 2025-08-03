// ===== IPFS CONFIGURATION FOR UMC LANDING PAGE =====

import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { http } from '@helia/http'

// IPFS configuration
const ipfsConfig = {
  // Helia configuration
  helia: {
    // Enable HTTP gateway
    gateways: [
      'https://ipfs.io',
      'https://gateway.pinata.cloud',
      'https://cloudflare-ipfs.com'
    ],
    
    // Pinning services
    pinning: {
      services: [
        {
          name: 'pinata',
          endpoint: 'https://api.pinata.cloud/psa',
          token: process.env.PINATA_TOKEN
        },
        {
          name: 'infura',
          endpoint: 'https://ipfs.infura.io:5001/api/v0',
          token: process.env.INFURA_TOKEN
        }
      ]
    },
    
    // Content routing
    routing: {
      // Enable DHT for content discovery
      dht: true,
      
      // Enable pubsub for real-time updates
      pubsub: true
    }
  },
  
  // Deployment settings
  deployment: {
    // Auto-pin after deployment
    autoPin: true,
    
    // Gateway URLs for access
    gateways: [
      'https://ipfs.io/ipfs/',
      'https://gateway.pinata.cloud/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/'
    ],
    
    // ENS domain (future)
    ensDomain: 'umc.eth'
  }
}

// Initialize Helia instance
let helia = null
let fs = null

export async function initIPFS() {
  try {
    if (!helia) {
      helia = await createHelia(ipfsConfig.helia)
      fs = unixfs(helia)
      
      console.log('🌐 IPFS initialized successfully')
      console.log('📡 Node ID:', helia.libp2p.peerId.toString())
    }
    
    return { helia, fs }
  } catch (error) {
    console.error('❌ IPFS initialization failed:', error)
    throw error
  }
}

// Deploy to IPFS
export async function deployToIPFS(buildPath = 'dist') {
  try {
    const { fs } = await initIPFS()
    
    console.log('🚀 Starting IPFS deployment...')
    
    // Add directory to IPFS
    const cid = await fs.addDirectory(buildPath)
    
    console.log('✅ Deployment successful!')
    console.log('🔗 CID:', cid.toString())
    
    // Generate access URLs
    const urls = ipfsConfig.deployment.gateways.map(gateway => 
      gateway + cid.toString()
    )
    
    console.log('🌐 Access URLs:')
    urls.forEach(url => console.log('   ', url))
    
    // Auto-pin if enabled
    if (ipfsConfig.deployment.autoPin) {
      console.log('📌 Auto-pinning content...')
      await helia.pins.add(cid)
    }
    
    return {
      cid: cid.toString(),
      urls,
      ipfsUrl: `ipfs://${cid.toString()}`
    }
  } catch (error) {
    console.error('❌ IPFS deployment failed:', error)
    throw error
  }
}

// Get file from IPFS
export async function getFromIPFS(cid, path = '') {
  try {
    const { fs } = await initIPFS()
    
    const fullPath = path ? `${cid}/${path}` : cid
    const chunks = []
    
    for await (const chunk of fs.cat(fullPath)) {
      chunks.push(chunk)
    }
    
    return Buffer.concat(chunks)
  } catch (error) {
    console.error('❌ Failed to get file from IPFS:', error)
    throw error
  }
}

// List directory contents
export async function listIPFSDirectory(cid) {
  try {
    const { fs } = await initIPFS()
    const contents = []
    
    for await (const entry of fs.ls(cid)) {
      contents.push({
        name: entry.name,
        type: entry.type,
        size: entry.size,
        cid: entry.cid.toString()
      })
    }
    
    return contents
  } catch (error) {
    console.error('❌ Failed to list IPFS directory:', error)
    throw error
  }
}

// Update content (create new version)
export async function updateIPFSContent(oldCid, newPath) {
  try {
    console.log('🔄 Updating IPFS content...')
    
    // Add new content
    const newCid = await deployToIPFS(newPath)
    
    // Keep old version pinned for history
    console.log('📌 Keeping old version for history:', oldCid)
    
    return newCid
  } catch (error) {
    console.error('❌ IPFS update failed:', error)
    throw error
  }
}

// Health check
export async function checkIPFSHealth() {
  try {
    const { helia } = await initIPFS()
    
    const status = {
      nodeId: helia.libp2p.peerId.toString(),
      isOnline: helia.libp2p.isStarted(),
      connections: helia.libp2p.getConnections().length,
      protocols: helia.libp2p.getProtocols()
    }
    
    console.log('🏥 IPFS Health Check:', status)
    return status
  } catch (error) {
    console.error('❌ IPFS health check failed:', error)
    throw error
  }
}

// Utility functions
export const ipfsUtils = {
  // Convert CID to different formats
  cidToV0: (cid) => cid.toV0().toString(),
  cidToV1: (cid) => cid.toV1().toString(),
  
  // Validate CID
  isValidCID: (cid) => {
    try {
      return cid && cid.toString().length > 0
    } catch {
      return false
    }
  },
  
  // Get gateway URL
  getGatewayUrl: (cid, gateway = 'https://ipfs.io/ipfs/') => {
    return gateway + cid.toString()
  },
  
  // Get IPFS URL
  getIPFSUrl: (cid) => {
    return `ipfs://${cid.toString()}`
  }
}

// Environment variables
export const env = {
  PINATA_TOKEN: process.env.PINATA_TOKEN,
  INFURA_TOKEN: process.env.INFURA_TOKEN,
  NODE_ENV: process.env.NODE_ENV || 'development'
}

// Export configuration
export { ipfsConfig }

// Default export
export default {
  initIPFS,
  deployToIPFS,
  getFromIPFS,
  listIPFSDirectory,
  updateIPFSContent,
  checkIPFSHealth,
  ipfsUtils,
  env
} 