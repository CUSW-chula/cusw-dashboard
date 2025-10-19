#!/bin/sh

echo "=== Starting CUSW Dashboard ==="
echo "VITE_IS_DEV: ${VITE_IS_DEV:-no}"
echo "==============================="

# Start the application
exec bun run preview
