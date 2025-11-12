# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    mkdir logs
    echo "Created logs directory"
fi

# Create .env.local if it doesn't exist
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "Created frontend/.env.local"
fi


