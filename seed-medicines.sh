#!/bin/bash

# Seed Medicines Script
# This script seeds the database with sample medicine data

echo "Seeding Medicine Catalog Data"
echo "=============================="
echo ""

# Database connection details
DB_HOST="localhost"
DB_PORT="5433"
DB_NAME="pharmacy_db"
DB_USER="pharmacy_user"
DB_PASSWORD="pharmacy_pass"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql command not found. Please ensure PostgreSQL client tools are installed."
    echo ""
    echo "You can also run the seed script manually:"
    echo "  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seed_medicines.sql"
    exit 1
fi

echo "Connecting to database..."
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo ""

# Run the seed script
echo "Running seed script..."
SEED_SCRIPT="$(dirname "$0")/database/seed_medicines.sql"

if [ ! -f "$SEED_SCRIPT" ]; then
    echo "ERROR: Seed script not found at: $SEED_SCRIPT"
    exit 1
fi

export PGPASSWORD=$DB_PASSWORD
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$SEED_SCRIPT"

if [ $? -eq 0 ]; then
    echo ""
    echo "SUCCESS: Medicine catalog seeded successfully!"
    echo ""
    echo "The database now contains:"
    echo "  - 25 different medicines"
    echo "  - Multiple inventory batches per medicine"
    echo "  - Various forms (Tablets, Capsules, Syrups, Creams, Drops)"
    echo "  - Different schedules (H, H1, X, NONE)"
    echo "  - Prescription and OTC medicines"
    echo ""
else
    echo ""
    echo "ERROR: Failed to seed database"
    exit 1
fi

unset PGPASSWORD

echo ""
echo "You can now test the catalog API:"
echo "  GET http://localhost:8084/api/catalog/medicines"
echo ""


