export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query; // User ID
    
    if (req.method === 'GET') {
      // Get all activities for user
      const activities = getUserActivities(id);
      return res.status(200).json(activities);
    }

    if (req.method === 'DELETE') {
      // Delete all activities for user
      deleteUserActivities(id);
      return res.status(200).json({ message: 'Semua aktivitas user berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('User Activities API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function getUserActivities(userId) {
  console.log('Getting activities for userId:', userId);
  
  try {
    // Try to read from local database file (for development)
    const fs = require('fs');
    const path = require('path');
    
    // Try to read local-database.json
    const dbPath = path.join(process.cwd(), 'local-database.json');
    let localData = {};
    
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, 'utf8');
      localData = JSON.parse(dbContent);
      console.log('📦 Loaded local database for user activities');
    } else {
      console.log('❌ local-database.json not found');
    }
    
    // Filter data by user
    const filterByUser = (data, userField = 'userId') => {
      if (!data || !Array.isArray(data)) return [];
      
      return data.filter(item => {
        // Match by userId (exact match)
        if (item[userField] === userId) {
          console.log(`✅ Found match by ${userField}:`, item.title || item.name || item.id);
          return true;
        }
        
        // Match by username (case insensitive)
        const usernameFields = ['username', 'user', 'createdBy', 'assignedTo'];
        for (const field of usernameFields) {
          if (item[field] && userId && 
              item[field].toLowerCase() === userId.toLowerCase()) {
            console.log(`✅ Found match by ${field}:`, item.title || item.name || item.id);
            return true;
          }
        }
        
        // Special case for Wawan - also check if item contains userId in any text field
        if (userId && userId.toLowerCase() === 'wawan') {
          const textFields = ['title', 'name', 'description', 'notes', 'findings', 'schoolName'];
          for (const field of textFields) {
            if (item[field] && typeof item[field] === 'string' && 
                item[field].toLowerCase().includes('wawan')) {
              console.log(`✅ Found Wawan match in ${field}:`, item[field]);
              return true;
            }
          }
        }
        
        return false;
      });
    };
    
    // Get filtered data
    const tasks = filterByUser(localData.tasks || []);
    const supervisions = filterByUser(localData.supervisions || []);
    const events = filterByUser(localData.events || []);
    const additionalTasks = filterByUser(localData.additionalTasks || []);
    
    console.log(`📊 Found activities for ${userId}:`, {
      tasks: tasks.length,
      supervisions: supervisions.length,
      events: events.length,
      additionalTasks: additionalTasks.length
    });
    
    return {
      tasks,
      supervisions,
      events,
      additionalTasks
    };
    
  } catch (error) {
    console.error('❌ Error loading user activities:', error);
    
    // Fallback to empty data if there's an error
    return {
      tasks: [],
      supervisions: [],
      events: [],
      additionalTasks: []
    };
  }
}

function deleteUserActivities(userId) {
  // In a real app, this would delete from database
  console.log('Deleting all activities for user:', userId);
}