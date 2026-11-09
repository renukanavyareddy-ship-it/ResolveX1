const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

async function autoSeedIfEmpty() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(` Database already contains ${userCount} users. Auto-seeding skipped.`);
      return;
    }

    console.log(' Database is empty. Auto-seeding initial demo administrator, users, and complaints...');

    // 1. Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@resolvex.com',
      password: 'Admin@123',
      phone: '+1 (555) 019-2834',
      address: 'ResolveX Grievance Redressal HQ, Tower 4, Civic Centre',
      role: 'admin'
    });

    // 2. Citizens
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

    // 3. 16 Complaints
    const complaintsData = [
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
      }
    ];

    await Complaint.insertMany(complaintsData);

    // 4. Sample notifications
    await Notification.create([
      {
        userId: users[0]._id,
        trackingId: 'RX-202611-1001',
        title: 'Status Update: In Progress',
        message: 'Your complaint regarding water contamination in Block B is currently under field investigation.',
        type: 'status_change'
      },
      {
        userId: users[1]._id,
        trackingId: 'RX-202611-1002',
        title: 'Grievance Resolved',
        message: 'Road pothole near St. Mary School has been repaired. Please share your rating.',
        type: 'feedback_request'
      }
    ]);

    console.log(' Auto-seeding completed successfully with demo records!');
  } catch (err) {
    console.error('Auto-seed error:', err.message);
  }
}

module.exports = autoSeedIfEmpty;
