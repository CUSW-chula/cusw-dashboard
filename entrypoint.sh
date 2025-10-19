#!/bin/sh

echo "=== Entrypoint Script Started ==="
echo "VITE_IS_DEV: ${VITE_IS_DEV:-no}"

# Find where the built files are
echo "Looking for build directories..."
ls -la /app/ || true
ls -la /app/build/ 2>/dev/null || true
ls -la /app/build/client/ 2>/dev/null || true

# Try multiple possible paths
if [ -d "/app/build/client" ]; then
    TARGET_DIR="/app/build/client"
elif [ -d "/app/build" ]; then
    TARGET_DIR="/app/build"
elif [ -d "/app/.svelte-kit/output/client" ]; then
    TARGET_DIR="/app/.svelte-kit/output/client"
else
    TARGET_DIR="/app/build/client"
    mkdir -p "$TARGET_DIR"
fi

echo "Using target directory: $TARGET_DIR"

# Generate env.js from environment variables at runtime
cat > "$TARGET_DIR/env.js" <<EOF
console.log('env.js loaded!');
window.__ENV__ = {
	VITE_IS_DEV: '${VITE_IS_DEV:-no}'
};
console.log('window.__ENV__ set to:', window.__ENV__);
EOF

echo "Generated env.js:"
cat "$TARGET_DIR/env.js"
echo "==================================="

# Start the application
exec bun run preview
