#!/bin/sh

# Generate env.js from environment variables at runtime
cat > /app/build/client/env.js <<EOF
window.__ENV__ = {
	VITE_IS_DEV: '${VITE_IS_DEV:-no}'
};
EOF

# Start the application
exec bun run preview
