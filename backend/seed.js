require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    console.log(' Connecting to MongoDB for seeding...');
    await connectDB();

    console.log(' Clearing existing collections...');
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Notification.deleteMany({});

    console.log(' Creating Administrator and User accounts...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@resolvex.com',
      password: 'Admin@123',
      phone: '+1 (555) 019-2834',
      address: 'ResolveX Grievance Redressal HQ, Tower 4, Civic Centre',
      role: 'admin'
    });

    // 2. Create 5 Citizen Users
    const users = await User.create([
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        password: 'User@123',
        phone: '+1 (555) 234-5678',
        address: '42 Green Park Residency, Sector 15',
        role: 'user'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        password: 'User@123',
        phone: '+1 (555) 345-6789',
        address: '108 Metro Heights, Block C',
        role: 'user'
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        password: 'User@123',
        phone: '+1 (555) 456-7890',
        address: '74 Silicon Boulevard, Cyber City',
        role: 'user'
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        password: 'User@123',
        phone: '+1 (555) 567-8901',
        address: '22 Sunshine Meadows, East Wing',
        role: 'user'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        password: 'User@123',
        phone: '+1 (555) 678-9012',
        address: '15 Heritage Commercial Square',
        role: 'user'
      }
    ]);

    console.log(` Created 1 Admin and ${users.length} Users.`);
    console.log(' Creating realistic sample complaints across all 10 categories...');

    const sampleComplaints = [
      {
        trackingId: 'RX-202611-1001',
        userId: users[0]._id,
        title: 'Severe tap water contamination and foul odor in Block B',
        description: 'For the past three days, tap water supplied to Block B has a yellowish color and pungent odor. Multiple families have reported stomach discomfort. We request immediate sample collection and pipeline flushing.',
        category: 'Water Supply',
        priority: 'High',
        location: {
          address: 'Block B, Green Park Residency',
          city: 'Metropolis',
          landmark: 'Near Community Water Tank #4',
          pincode: '100015'
        },
        status: 'In Progress',
        department: 'Water Supply & Sewerage Board',
        assignedTo: {
          name: 'Eng. Rajesh Verma',
          department: 'Water Supply & Sewerage Board',
          email: 'r.verma@watersupply.gov',
          phone: '+1 (555) 901-1122',
          assignedAt: new Date(Date.now() - 36 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Maintenance team dispatched to inspect feeder valve #12. Water tankers arranged in the interim.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 24 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Complaint logged by citizen.',
            changedBy: users[0]._id,
            changedByName: users[0].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 48 * 3600 * 1000)
          },
          {
            status: 'Under Review',
            comment: 'Reviewed by Grievance Desk. Escalated to high priority.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 40 * 3600 * 1000)
          },
          {
            status: 'In Progress',
            comment: 'Field crew conducting leak test on primary distribution pipeline.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 20 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1002',
        userId: users[1]._id,
        title: 'Dangerous deep pothole on Main Avenue near St. Mary High School',
        description: 'A large crater-like pothole roughly 2 feet wide and 8 inches deep has formed right outside the school gate. Two two-wheelers skidded yesterday during rainfall.',
        category: 'Roads and Transportation',
        priority: 'High',
        location: {
          address: 'Main Avenue Road, Pillar #34',
          city: 'Metropolis',
          landmark: 'Directly opposite St. Mary High School Gate',
          pincode: '100021'
        },
        status: 'Resolved',
        department: 'Public Works Department (PWD)',
        assignedTo: {
          name: 'Supervisor Anil Kapoor',
          department: 'Public Works Department (PWD)',
          email: 'a.kapoor@pwd.gov',
          phone: '+1 (555) 902-3344',
          assignedAt: new Date(Date.now() - 96 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Road resurfacing and cold-mix bitumen patching completed. Quality inspection certified.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 12 * 3600 * 1000)
        },
        feedback: {
          rating: 5,
          comment: 'Very impressed! The road was fixed within 48 hours and is smooth now. Thank you team!',
          submittedAt: new Date(Date.now() - 6 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Complaint registered with photo evidence.',
            changedBy: users[1]._id,
            changedByName: users[1].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 120 * 3600 * 1000)
          },
          {
            status: 'Assigned',
            comment: 'Work order #PWD-849 issued to rapid road repair division.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 96 * 3600 * 1000)
          },
          {
            status: 'Resolved',
            comment: 'Bitumen patch laid and roller compacted.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 12 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1003',
        userId: users[2]._id,
        title: 'Frequent high voltage spikes damaging household electronics',
        description: 'Repeated sudden voltage spikes up to 290V have been occurring between 6 PM and 9 PM for three consecutive evenings. Several residents had their refrigerators and microwave fuses blown out.',
        category: 'Electricity',
        priority: 'Critical',
        location: {
          address: 'Silicon Boulevard, Tech City Phase 1',
          city: 'Metropolis',
          landmark: 'Substation Transformer #T-09',
          pincode: '100056'
        },
        status: 'Under Review',
        department: 'State Electricity Transmission Board',
        assignedTo: {
          name: 'Lead Eng. Sunita Rao',
          department: 'State Electricity Transmission Board',
          email: 's.rao@electricity.gov',
          phone: '+1 (555) 903-5566',
          assignedAt: new Date(Date.now() - 10 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Urgent telemetry logs requested from Substation #T-09. Line inspectors assigned to check the neutral tap changer.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 8 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Complaint submitted with multimeter readings.',
            changedBy: users[2]._id,
            changedByName: users[2].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 18 * 3600 * 1000)
          },
          {
            status: 'Under Review',
            comment: 'Marked Critical by Admin due to risk of fire hazards.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 10 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1004',
        userId: users[3]._id,
        title: 'Overflowing municipal waste bins causing public health hazard',
        description: 'The solid waste collection bins outside the Sunshine Market have not been cleared for over five days. Garbage has spilled onto the walkway, emitting strong odor and attracting stray cattle.',
        category: 'Sanitation and Cleanliness',
        priority: 'Medium',
        location: {
          address: 'Sunshine Market Complex, East Gate',
          city: 'Metropolis',
          landmark: 'Behind Bus Shelter #12',
          pincode: '100078'
        },
        status: 'Assigned',
        department: 'Municipal Sanitation Department',
        assignedTo: {
          name: 'Sanitation Officer Ramesh Jadhav',
          department: 'Municipal Sanitation Department',
          email: 'r.jadhav@sanitation.gov',
          phone: '+1 (555) 904-7788',
          assignedAt: new Date(Date.now() - 14 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Logged by citizen.',
            changedBy: users[3]._id,
            changedByName: users[3].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 28 * 3600 * 1000)
          },
          {
            status: 'Assigned',
            comment: 'Compactor truck route redirected to Sunshine Market.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 14 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1005',
        userId: users[4]._id,
        title: 'Series of 6 non-functional LED street lights on Commercial Street',
        description: 'The street lights from shop #1 to #25 have been pitch dark every evening for the past week. Customers feel unsafe walking after dark and shopkeepers are concerned about burglaries.',
        category: 'Street Lights',
        priority: 'Low',
        location: {
          address: 'Commercial Street, Old Heritage Market',
          city: 'Metropolis',
          landmark: 'Clock Tower Junction',
          pincode: '100001'
        },
        status: 'Submitted',
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Submitted by shopkeeper association.',
            changedBy: users[4]._id,
            changedByName: users[4].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 6 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1006',
        userId: users[0]._id,
        title: 'Open stormwater drain with missing concrete slab near playground',
        description: 'A 5-foot deep concrete drain has an exposed opening right where children play soccer in the afternoons. It poses an immediate risk of fatal falling.',
        category: 'Public Safety',
        priority: 'Critical',
        location: {
          address: 'Community Park, Sector 15',
          city: 'Metropolis',
          landmark: 'North boundary adjacent to children swings',
          pincode: '100015'
        },
        status: 'In Progress',
        department: 'Public Works Department (PWD)',
        assignedTo: {
          name: 'Safety Inspector Vikas Chawla',
          department: 'Public Works Department (PWD)',
          email: 'v.chawla@pwd.gov',
          phone: '+1 (555) 905-8899',
          assignedAt: new Date(Date.now() - 8 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Temporary safety barricades and warning ribbons installed. Replacement reinforced concrete slab ordered.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 7 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Citizen flagged critical hazard.',
            changedBy: users[0]._id,
            changedByName: users[0].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 12 * 3600 * 1000)
          },
          {
            status: 'In Progress',
            comment: 'Barricaded by emergency civic response.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 8 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1007',
        userId: users[1]._id,
        title: 'Broken window panes and roof water seepage in Science Lab',
        description: 'At Government Secondary Girls School, recent heavy rain caused roof leakage onto the computer systems, and four window glass panes are cracked, letting in cold drafts.',
        category: 'Education',
        priority: 'Medium',
        location: {
          address: 'Govt Secondary Girls School, 4th Cross Road',
          city: 'Metropolis',
          landmark: 'Main Academic Block Room #104',
          pincode: '100021'
        },
        status: 'Under Review',
        department: 'Department of Public Education & Infrastructure',
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Submitted by parent-teacher association.',
            changedBy: users[1]._id,
            changedByName: users[1].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 30 * 3600 * 1000)
          },
          {
            status: 'Under Review',
            comment: 'Forwarded to District Education Officer for building maintenance sanctions.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 18 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1008',
        userId: users[3]._id,
        title: 'Severe shortage of basic pediatric antibiotics and insulin vials',
        description: 'The Primary Health Dispensary at Sunshine Colony has been out of essential pediatric oral suspensions and insulin syringes for 10 days. Patients are being turned away.',
        category: 'Healthcare',
        priority: 'High',
        location: {
          address: 'Urban Primary Health Centre, Sunshine Colony',
          city: 'Metropolis',
          landmark: 'Opposite Community Hall',
          pincode: '100078'
        },
        status: 'Assigned',
        department: 'Directorate of Health Services',
        assignedTo: {
          name: 'Dr. Meenakshi Sundaram',
          department: 'Directorate of Health Services',
          email: 'm.sundaram@health.gov',
          phone: '+1 (555) 906-0011',
          assignedAt: new Date(Date.now() - 16 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Central pharmacy warehouse notified. Emergency buffer stock allocated for immediate delivery.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 12 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Logged by resident doctor.',
            changedBy: users[3]._id,
            changedByName: users[3].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 24 * 3600 * 1000)
          },
          {
            status: 'Assigned',
            comment: 'Stock requisition fast-tracked.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 16 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1009',
        userId: users[2]._id,
        title: 'Structural concrete spalling on Railway Overbridge Pillar #7',
        description: 'Visible cracks and chunks of fallen concrete noted at the base of support pillar #7 on the Central Railway Overbridge. Rust is visible on internal reinforcement steel.',
        category: 'Infrastructure',
        priority: 'Critical',
        location: {
          address: 'Central Station Railway Overbridge',
          city: 'Metropolis',
          landmark: 'Platform #2 south pier',
          pincode: '100002'
        },
        status: 'In Progress',
        department: 'Urban Development & Railway Engineering Authority',
        assignedTo: {
          name: 'Chief Structural Engineer K. Narayanan',
          department: 'Urban Development & Railway Engineering Authority',
          email: 'k.narayanan@railway.gov',
          phone: '+1 (555) 907-2233',
          assignedAt: new Date(Date.now() - 48 * 3600 * 1000)
        },
        adminResponse: {
          message: 'NDT (Non-Destructive Testing) ultrasonic ultrasound inspection underway. Heavy vehicle traffic diverted to bypass road as precaution.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 36 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Critical structural concern registered.',
            changedBy: users[2]._id,
            changedByName: users[2].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 72 * 3600 * 1000)
          },
          {
            status: 'In Progress',
            comment: 'Bridge engineering assessment initiated with ultrasonic equipment.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 48 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1010',
        userId: users[4]._id,
        title: 'Excessive industrial generator decibel noise after midnight',
        description: 'A commercial warehousing facility operates heavy un-muffled diesel generators between 1 AM and 5 AM, violating residential noise pollution guidelines.',
        category: 'Other',
        priority: 'Low',
        location: {
          address: 'Industrial Plot 88, Border Ring Road',
          city: 'Metropolis',
          landmark: 'Near Warehousing Zone 4',
          pincode: '100099'
        },
        status: 'Resolved',
        department: 'Pollution Control Board',
        assignedTo: {
          name: 'Officer Deepak Joshi',
          department: 'Pollution Control Board',
          email: 'd.joshi@pcb.gov',
          phone: '+1 (555) 908-4455',
          assignedAt: new Date(Date.now() - 72 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Notice issued under Environmental Protection Act. Facility owner installed acoustic sound enclosures on generators.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 20 * 3600 * 1000)
        },
        feedback: {
          rating: 4,
          comment: 'Noise has significantly reduced. Appreciate the prompt inspection by the pollution control officer.',
          submittedAt: new Date(Date.now() - 10 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Complaint logged.',
            changedBy: users[4]._id,
            changedByName: users[4].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 96 * 3600 * 1000)
          },
          {
            status: 'Assigned',
            comment: 'Decibel monitoring scheduled.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 72 * 3600 * 1000)
          },
          {
            status: 'Resolved',
            comment: 'Acoustic dampers installed and compliance verified.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 20 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1011',
        userId: users[0]._id,
        title: 'Extremely low water pressure on 3rd and 4th floor apartments',
        description: 'The booster pump at the municipal underground reservoir seems to be tripping, resulting in zero water flow during morning distribution hours.',
        category: 'Water Supply',
        priority: 'Medium',
        location: {
          address: '42 Green Park Residency, Sector 15',
          city: 'Metropolis',
          landmark: 'Tower C',
          pincode: '100015'
        },
        status: 'Submitted',
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Submitted by resident.',
            changedBy: users[0]._id,
            changedByName: users[0].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 5 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1012',
        userId: users[1]._id,
        title: 'Broken traffic signal at 4-way Junction causing massive bottlenecks',
        description: 'The green light remains on for 3 directions simultaneously, causing gridlock and near collisions during rush hour.',
        category: 'Roads and Transportation',
        priority: 'High',
        location: {
          address: 'Metro Heights Junction, Ring Road',
          city: 'Metropolis',
          landmark: 'Intersection with Highway 9',
          pincode: '100021'
        },
        status: 'Resolved',
        department: 'Traffic Police & Road Safety Cell',
        assignedTo: {
          name: 'Traffic Engineer S. Balakrishnan',
          department: 'Traffic Police & Road Safety Cell',
          email: 's.balakrishnan@traffic.gov',
          phone: '+1 (555) 909-6677',
          assignedAt: new Date(Date.now() - 40 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Microcontroller logic board in traffic controller cabinet replaced and signal timing synchronized.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 15 * 3600 * 1000)
        },
        feedback: {
          rating: 5,
          comment: 'Signal timing is working normally now, traffic is flowing smoothly. Great job!',
          submittedAt: new Date(Date.now() - 8 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Logged by commuter.',
            changedBy: users[1]._id,
            changedByName: users[1].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 48 * 3600 * 1000)
          },
          {
            status: 'Resolved',
            comment: 'Traffic signal board replaced.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 15 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1013',
        userId: users[2]._id,
        title: 'Overhead high-tension cable sagging dangerously near residential balcony',
        description: 'Heavy winds last night caused the overhead electric distribution wire to sag to within 3 feet of the second floor balcony.',
        category: 'Electricity',
        priority: 'Critical',
        location: {
          address: 'Plot 14, Silicon Avenue',
          city: 'Metropolis',
          landmark: 'Near Electric Pole #EL-409',
          pincode: '100056'
        },
        status: 'In Progress',
        department: 'State Electricity Transmission Board',
        assignedTo: {
          name: 'Lead Eng. Sunita Rao',
          department: 'State Electricity Transmission Board',
          email: 's.rao@electricity.gov',
          phone: '+1 (555) 903-5566',
          assignedAt: new Date(Date.now() - 6 * 3600 * 1000)
        },
        adminResponse: {
          message: 'Line maintenance bucket truck dispatched to re-tension cable and install stay-wire support.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 4 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Reported with urgency.',
            changedBy: users[2]._id,
            changedByName: users[2].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 10 * 3600 * 1000)
          },
          {
            status: 'In Progress',
            comment: 'Emergency line crew assigned.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 6 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1014',
        userId: users[3]._id,
        title: 'Reopened: Illegal waste dumping on vacant municipal land',
        description: 'Although previously reported cleared, construction debris and medical waste are continuously being dumped after midnight because the gate was left unchained.',
        category: 'Sanitation and Cleanliness',
        priority: 'High',
        location: {
          address: 'Vacant Plot 22, Sunshine Colony Perimeter',
          city: 'Metropolis',
          landmark: 'Beside Storm Drain #3',
          pincode: '100078'
        },
        status: 'Reopened',
        department: 'Municipal Sanitation Department',
        adminResponse: {
          message: 'Reopened for investigation. Municipal vigilance squad instructed to conduct night patrols and install a steel gate.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 2 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Initial complaint submitted.',
            changedBy: users[3]._id,
            changedByName: users[3].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 150 * 3600 * 1000)
          },
          {
            status: 'Resolved',
            comment: 'Waste cleared.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 40 * 3600 * 1000)
          },
          {
            status: 'Reopened',
            comment: 'Reopened by citizen. Reason: Waste dumping started again due to lack of gate lock.',
            changedBy: users[3]._id,
            changedByName: users[3].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 14 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1015',
        userId: users[4]._id,
        title: 'Commercial vehicles blocking private residential garage exit',
        description: 'Commercial logistics vans park horizontally across residential driveways during morning delivery hours from 8 AM to 11 AM.',
        category: 'Public Safety',
        priority: 'Low',
        location: {
          address: '15 Heritage Commercial Square',
          city: 'Metropolis',
          landmark: 'Lane #4 Exit',
          pincode: '100001'
        },
        status: 'Rejected',
        adminResponse: {
          message: 'Private property dispute falls under building society condominium bylaws. Civic authority jurisdiction is limited to gazetted public thoroughfares.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 22 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Complaint logged.',
            changedBy: users[4]._id,
            changedByName: users[4].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 40 * 3600 * 1000)
          },
          {
            status: 'Rejected',
            comment: 'Rejected: Outside municipal jurisdiction (private society road).',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 22 * 3600 * 1000)
          }
        ]
      },
      {
        trackingId: 'RX-202611-1016',
        userId: users[0]._id,
        title: 'Broken high-mast park illumination pole lights',
        description: 'Two floodlight lamps atop the central park mast pole are burned out, casting shadows over the walking track.',
        category: 'Street Lights',
        priority: 'Low',
        location: {
          address: 'Sector 15 Jogger Park',
          city: 'Metropolis',
          landmark: 'Central fountain plaza',
          pincode: '100015'
        },
        status: 'Resolved',
        department: 'Parks & Recreation Electrical Wing',
        adminResponse: {
          message: 'Crane lift deployed and LED driver components replaced. All fixtures operational.',
          respondedBy: admin.name,
          respondedAt: new Date(Date.now() - 18 * 3600 * 1000)
        },
        feedback: {
          rating: 4,
          comment: 'Park is well-lit again. Good response time.',
          submittedAt: new Date(Date.now() - 14 * 3600 * 1000)
        },
        statusHistory: [
          {
            status: 'Submitted',
            comment: 'Logged by park visitor.',
            changedBy: users[0]._id,
            changedByName: users[0].name,
            changedByRole: 'user',
            timestamp: new Date(Date.now() - 60 * 3600 * 1000)
          },
          {
            status: 'Resolved',
            comment: 'Lamps replaced.',
            changedBy: admin._id,
            changedByName: admin.name,
            changedByRole: 'admin',
            timestamp: new Date(Date.now() - 18 * 3600 * 1000)
          }
        ]
      }
    ];

    const insertedComplaints = await Complaint.insertMany(sampleComplaints);
    console.log(` Created ${insertedComplaints.length} sample complaints successfully.`);

    // 3. Create Sample Notifications
    console.log(' Generating user notifications...');
    const notifications = [
      {
        userId: users[0]._id,
        complaintId: insertedComplaints[0]._id,
        trackingId: insertedComplaints[0].trackingId,
        title: 'Complaint Status: In Progress',
        message: 'Your complaint regarding water contamination has been assigned to Water Supply Board and field crew is on-site.',
        type: 'status_change',
        isRead: false
      },
      {
        userId: users[1]._id,
        complaintId: insertedComplaints[1]._id,
        trackingId: insertedComplaints[1].trackingId,
        title: 'Complaint Resolved',
        message: 'Pothole repair outside St. Mary School has been completed. Please rate our resolution quality.',
        type: 'feedback_request',
        isRead: true
      },
      {
        userId: users[2]._id,
        complaintId: insertedComplaints[2]._id,
        trackingId: insertedComplaints[2].trackingId,
        title: 'Complaint Under Review',
        message: 'Your complaint regarding electrical voltage spikes is under priority technical review.',
        type: 'status_change',
        isRead: false
      },
      {
        userId: users[3]._id,
        complaintId: insertedComplaints[3]._id,
        trackingId: insertedComplaints[3].trackingId,
        title: 'Complaint Assigned',
        message: 'Garbage overflow complaint assigned to Municipal Sanitation Officer Ramesh Jadhav.',
        type: 'assignment',
        isRead: false
      }
    ];

    await Notification.insertMany(notifications);
    console.log(` Created ${notifications.length} notifications.`);

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETE SUCCESSFULLY!');
    console.log('======================================================');
    console.log(' DEMO CREDENTIALS:');
    console.log(' 👑 Administrator:');
    console.log('    Email:    admin@resolvex.com');
    console.log('    Password: Admin@123');
    console.log('');
    console.log(' 👤 Citizen Users:');
    console.log('    Email:    rahul.sharma@example.com   | Password: User@123');
    console.log('    Email:    priya.patel@example.com    | Password: User@123');
    console.log('    Email:    amit.kumar@example.com     | Password: User@123');
    console.log('    Email:    sneha.reddy@example.com    | Password: User@123');
    console.log('    Email:    vikram.singh@example.com   | Password: User@123');
    console.log('======================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
