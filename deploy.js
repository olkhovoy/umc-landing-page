#!/usr/bin/env node

// ===== UMC LANDING PAGE DEPLOYMENT SCRIPT =====

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = __dirname

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
  log(`\n${step} ${message}`, 'cyan')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

// Check if build directory exists
function checkBuildDirectory() {
  const buildPath = join(projectRoot, 'dist')
  
  if (!existsSync(buildPath)) {
    logError('Build directory not found. Please run "npm run build" first.')
    process.exit(1)
  }
  
  logSuccess('Build directory found')
  return buildPath
}

// Build the project
async function buildProject() {
  logStep('🔨', 'Building project...')
  
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      cwd: projectRoot 
    })
    logSuccess('Project built successfully')
  } catch (error) {
    logError('Build failed')
    process.exit(1)
  }
}

// Deploy to IPFS
async function deployToIPFS(buildPath) {
  logStep('🚀', 'Deploying to IPFS...')
  
  try {
    // Import IPFS functions
    const { deployToIPFS: deploy, checkIPFSHealth } = await import('./ipfs.config.js')
    
    // Check IPFS health
    await checkIPFSHealth()
    
    // Deploy
    const result = await deploy(buildPath)
    
    logSuccess('Deployment completed!')
    log(`🔗 CID: ${result.cid}`, 'bright')
    log(`🌐 IPFS URL: ${result.ipfsUrl}`, 'bright')
    
    // Save deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      cid: result.cid,
      urls: result.urls,
      ipfsUrl: result.ipfsUrl,
      version: getPackageVersion()
    }
    
    writeFileSync(
      join(projectRoot, 'deployment.json'),
      JSON.stringify(deploymentInfo, null, 2)
    )
    
    logSuccess('Deployment info saved to deployment.json')
    
    return result
  } catch (error) {
    logError(`IPFS deployment failed: ${error.message}`)
    process.exit(1)
  }
}

// Get package version
function getPackageVersion() {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8')
    )
    return packageJson.version || '1.0.0'
  } catch {
    return '1.0.0'
  }
}

// Display deployment results
function displayResults(result) {
  logStep('📊', 'Deployment Results')
  
  log('Access your landing page at:', 'bright')
  result.urls.forEach((url, index) => {
    log(`  ${index + 1}. ${url}`, 'green')
  })
  
  log('\nIPFS Gateway URLs:', 'bright')
  log('  • https://ipfs.io/ipfs/' + result.cid, 'blue')
  log('  • https://gateway.pinata.cloud/ipfs/' + result.cid, 'blue')
  log('  • https://cloudflare-ipfs.com/ipfs/' + result.cid, 'blue')
  
  log('\nNext steps:', 'bright')
  log('  1. Test all gateway URLs', 'yellow')
  log('  2. Set up ENS domain (optional)', 'yellow')
  log('  3. Share the IPFS URL', 'yellow')
  log('  4. Monitor content availability', 'yellow')
}

// Main deployment function
async function main() {
  log('🌐 UMC Landing Page - IPFS Deployment', 'bright')
  log('=====================================\n')
  
  // Parse command line arguments
  const args = process.argv.slice(2)
  const shouldBuild = args.includes('--build') || args.includes('-b')
  const shouldSkipBuild = args.includes('--skip-build') || args.includes('-s')
  
  try {
    let buildPath
    
    if (shouldSkipBuild) {
      logWarning('Skipping build step')
      buildPath = checkBuildDirectory()
    } else if (shouldBuild) {
      await buildProject()
      buildPath = join(projectRoot, 'dist')
    } else {
      // Check if build exists, if not, build it
      const distPath = join(projectRoot, 'dist')
      if (existsSync(distPath)) {
        logSuccess('Using existing build')
        buildPath = distPath
      } else {
        logWarning('No build found, building project...')
        await buildProject()
        buildPath = distPath
      }
    }
    
    // Deploy to IPFS
    const result = await deployToIPFS(buildPath)
    
    // Display results
    displayResults(result)
    
    logSuccess('Deployment completed successfully!')
    
  } catch (error) {
    logError(`Deployment failed: ${error.message}`)
    process.exit(1)
  }
}

// Handle command line usage
function showUsage() {
  log('Usage:', 'bright')
  log('  node deploy.js [options]', 'cyan')
  log('\nOptions:', 'bright')
  log('  --build, -b        Force rebuild before deployment', 'yellow')
  log('  --skip-build, -s   Skip build step (use existing dist)', 'yellow')
  log('  --help, -h         Show this help message', 'yellow')
  log('\nExamples:', 'bright')
  log('  node deploy.js                    # Deploy (build if needed)', 'cyan')
  log('  node deploy.js --build            # Force rebuild and deploy', 'cyan')
  log('  node deploy.js --skip-build       # Deploy without building', 'cyan')
}

// Check for help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showUsage()
  process.exit(0)
}

// Run main function
main().catch(error => {
  logError(`Unexpected error: ${error.message}`)
  process.exit(1)
}) 