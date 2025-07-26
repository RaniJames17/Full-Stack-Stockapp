#!/bin/bash

# MongoDB User Promotion Script
# This script demonstrates how to promote users to admin role

echo "🔧 MongoDB User Promotion Commands"
echo "================================="
echo ""

echo "1. Connect to your MongoDB database:"
echo "   mongosh \"your-mongodb-connection-string\""
echo ""

echo "2. Switch to your application database:"
echo "   use your-database-name"
echo ""

echo "3. Promote a user to admin:"
echo "   db.users.updateOne({ email: \"admin@example.com\" }, { \$set: { role: \"admin\" } });"
echo ""

echo "4. Verify the promotion:"
echo "   db.users.findOne({ email: \"admin@example.com\" }, { email: 1, role: 1, name: 1 });"
echo ""

echo "5. List all admin users:"
echo "   db.users.find({ role: \"admin\" }, { email: 1, name: 1 });"
echo ""

echo "6. View role statistics:"
echo "   db.users.aggregate([{ \$group: { _id: \"\$role\", count: { \$sum: 1 } } }]);"
echo ""

echo "💡 Alternative Methods:"
echo "======================"
echo ""
echo "• Via Admin Panel: Visit /admin/roles after signing in as admin"
echo "• Via API: POST to /api/admin/update-role with proper authentication"
echo "• Via Admin Users Page: Visit /admin/users to see all users and get promotion commands"
echo ""

echo "⚠️  Important Notes:"
echo "==================="
echo "• Users must sign out and back in to refresh their session after role changes"
echo "• Only existing admin users can promote others via the web interface"
echo "• Direct MongoDB access should only be used by system administrators"
echo "• All available roles: user (default), admin, moderator"
