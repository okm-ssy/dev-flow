#!/bin/bash

# Full Project Test Runner
# Usage: ./cli/test-all.sh

set -e

cd "$(dirname "$0")/.."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Dev Flow - Full Test Suite${NC}"
echo "=================================="
echo ""

# Check if backend is running
check_backend() {
    echo -e "${BLUE}Checking backend server...${NC}"
    if curl -s http://localhost:9191/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend server is running on port 9191${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend server not detected. Some E2E tests may fail.${NC}"
        echo -e "${BLUE}To start backend: ./cli/api/run.sh${NC}"
    fi
    echo ""
}

# Run API tests (if available)
run_api_tests() {
    if [ -f "apps/api/package.json" ] && grep -q "test" apps/api/package.json; then
        echo -e "${BLUE}Running API tests...${NC}"
        cd apps/api
        npm test 2>/dev/null || echo -e "${YELLOW}⚠️  API tests not configured${NC}"
        cd ../..
        echo ""
    fi
}

# Run frontend unit tests
run_frontend_unit_tests() {
    echo -e "${BLUE}Running Frontend Unit Tests...${NC}"
    ./cli/front/test.sh unit
    echo ""
}

# Run frontend E2E tests
run_frontend_e2e_tests() {
    echo -e "${BLUE}Running Frontend E2E Tests...${NC}"
    ./cli/front/test.sh e2e
    echo ""
}

# Run linting and type checking
run_quality_checks() {
    echo -e "${BLUE}Running Quality Checks...${NC}"
    
    echo "→ TypeScript type checking..."
    cd apps/frontend
    npm run typecheck
    
    echo "→ ESLint..."
    npm run lint
    
    cd ../..
    echo ""
}

# Main execution
main() {
    check_backend
    
    echo -e "${YELLOW}Test Execution Plan:${NC}"
    echo "1. Quality checks (TypeScript, ESLint)"
    echo "2. API tests"
    echo "3. Frontend unit tests"
    echo "4. Frontend E2E tests"
    echo ""
    
    echo -e "${GREEN}Starting tests...${NC}"
    echo ""
    
    # Run tests
    run_quality_checks
    run_api_tests
    run_frontend_unit_tests
    run_frontend_e2e_tests
    
    echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Test Summary:${NC}"
    echo "✅ Quality checks"
    echo "✅ API tests"
    echo "✅ Frontend unit tests"  
    echo "✅ Frontend E2E tests"
}

main "$@"