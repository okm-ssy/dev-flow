#!/bin/bash

# Frontend Test Runner
# Usage: ./cli/front/test.sh [options]

set -e

cd "$(dirname "$0")/../.."
FRONTEND_DIR="apps/frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_usage() {
    echo "Frontend Test Runner"
    echo ""
    echo "Usage: ./cli/front/test.sh [command]"
    echo ""
    echo "Commands:"
    echo "  unit           Run unit tests (Vitest)"
    echo "  unit-ui        Run unit tests with UI"
    echo "  unit-coverage  Run unit tests with coverage"
    echo "  e2e            Run E2E tests (Playwright)"
    echo "  e2e-ui         Run E2E tests with UI"
    echo "  e2e-headed     Run E2E tests in headed mode"
    echo "  e2e-debug      Run E2E tests in debug mode"
    echo "  install        Install Playwright browsers"
    echo "  all            Run all tests (unit + e2e)"
    echo "  help           Show this help"
    echo ""
    echo "Examples:"
    echo "  ./cli/front/test.sh e2e"
    echo "  ./cli/front/test.sh unit-coverage"
    echo "  ./cli/front/test.sh all"
}

install_playwright() {
    echo -e "${BLUE}Installing Playwright browsers...${NC}"
    cd "$FRONTEND_DIR"
    npm run playwright:install
}

run_unit_tests() {
    echo -e "${BLUE}Running unit tests...${NC}"
    cd "$FRONTEND_DIR"
    npm run test:run
}

run_unit_tests_ui() {
    echo -e "${BLUE}Running unit tests with UI...${NC}"
    cd "$FRONTEND_DIR"
    npm run test:ui
}

run_unit_tests_coverage() {
    echo -e "${BLUE}Running unit tests with coverage...${NC}"
    cd "$FRONTEND_DIR"
    npm run test:coverage
}

run_e2e_tests() {
    echo -e "${BLUE}Running E2E tests...${NC}"
    cd "$FRONTEND_DIR"
    npm run test:e2e
}

run_e2e_tests_ui() {
    echo -e "${BLUE}Running E2E tests with UI...${NC}"
    cd "$FRONTEND_DIR"
    npm run test:e2e:ui
}

run_e2e_tests_headed() {
    echo -e "${BLUE}Running E2E tests in headed mode...${NC}"
    cd "$FRONTEND_DIR"
    npm run test:e2e:headed
}

run_e2e_tests_debug() {
    echo -e "${BLUE}Running E2E tests in debug mode...${NC}"
    cd "$FRONTEND_DIR"
    npm run test:e2e:debug
}

run_all_tests() {
    echo -e "${YELLOW}Running all tests...${NC}"
    echo ""
    
    echo -e "${BLUE}Step 1/2: Unit tests${NC}"
    run_unit_tests
    
    echo ""
    echo -e "${BLUE}Step 2/2: E2E tests${NC}"
    run_e2e_tests
    
    echo ""
    echo -e "${GREEN}✅ All tests completed successfully!${NC}"
}

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Parse command line arguments
case "${1:-help}" in
    "unit")
        run_unit_tests
        ;;
    "unit-ui")
        run_unit_tests_ui
        ;;
    "unit-coverage")
        run_unit_tests_coverage
        ;;
    "e2e")
        run_e2e_tests
        ;;
    "e2e-ui")
        run_e2e_tests_ui
        ;;
    "e2e-headed")
        run_e2e_tests_headed
        ;;
    "e2e-debug")
        run_e2e_tests_debug
        ;;
    "install")
        install_playwright
        ;;
    "all")
        run_all_tests
        ;;
    "help"|"--help"|"-h")
        print_usage
        ;;
    *)
        echo -e "${RED}Error: Unknown command '$1'${NC}"
        echo ""
        print_usage
        exit 1
        ;;
esac