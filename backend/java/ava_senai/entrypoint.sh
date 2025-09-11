#!/usr/bin/env bash
set -e

cd /app

# Toggle tests (default: skip tests for faster startup)
SKIP_TESTS="${SKIP_TESTS:-false}"

echo "JAVA: $(java -version 2>&1 | head -n1)"
echo "MAVEN: $(mvn -v | head -n1)"
echo "SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-default}"
echo "SKIP_TESTS=${SKIP_TESTS}"

# Always nuke old target/ and do a fresh build
echo "➡️  Cleaning previous build and packaging..."
rm -rf target || true
mvn -q -DskipTests="${SKIP_TESTS}" clean package

# Find the Spring Boot fat jar (exclude original-*.jar)
JAR_PATH="$(ls -1t target/*.jar 2>/dev/null | grep -Ev '(original-|plain\.jar$)' | head -n1 || true)"
if [ -z "${JAR_PATH}" ]; then
  echo "❌ Build failed: no runnable JAR found."
  ls -l target || true
  exit 1
fi

echo "✅ Built JAR: ${JAR_PATH}"
echo "🚀 Starting Spring Boot..."
exec java ${JAVA_OPTS:-} -jar "${JAR_PATH}"
