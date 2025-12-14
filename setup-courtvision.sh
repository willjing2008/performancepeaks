#!/bin/bash

echo "🏸 Setting up Court Vision Lab..."

# Create Next.js project
npx create-next-app@latest courtvision --typescript --tailwind --eslint --app --src-dir --use-npm --yes

cd courtvision

# Install dependencies
npm install openai lucide-react framer-motion recharts uuid @types/uuid

# Create directories
mkdir -p src/types src/lib src/components src/app/api/analyze

echo "✅ Project created! Now creating source files..."

