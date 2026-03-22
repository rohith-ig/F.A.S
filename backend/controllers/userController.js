const prisma = require("../config/database");

// controller for individual user fetching

exports.getIndividualUser = async (req, res) => {
  try { 
    const resp = req.user;
    res.status(200).json({ success:true, user: resp });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error fetching user" });
  }
};

// ADD USER
exports.addUser = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') { 
      console.log("Forbidden error"); 
      return res.status(401).json({"Error":"Unauthorised"}); 
    }
    const { name, email, role, roll, program, dept, designation1} = req.body;

    let userData = {
      name,
      email,
      role,
      profilePic:''
    };

    // If the user is a STUD
    if (role === "STUDENT") {
      userData.studentProfile = {
        create: {
          rollNumber:roll,
          designation:program,
          department:dept,
        },
      };
    }

    // If the user is a FACULTY
    if (role === "FACULTY") {
      userData.facultyProfile = {
        create: {
          department: dept,
          designation: designation1,
          // location,
          // subjects,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    res.json({ success: true, user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding user" });
  }
};



// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') { 
      console.log("Forbidden error"); 
      return res.status(401).json({"Error":"Unauthorised"}); 
    }
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user" });
  }
};



// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      console.log("Forbidden error at getusers");
      return res.status(401).json({"Error":"Unauthorised"});
    }
    const users = await prisma.user.findMany({
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
};



//upload users in csv
const fs = require("fs"); 
const csv = require("csv-parser");

exports.bulkUploadUsers = async (req, res) => { 
  try { 
    if (req.user.role !== "ADMIN") { 
      return res.status(401).json({ error: "Unauthorized" }); 
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (const row of results) {
  if (!row.name || !row.email) continue; 

  // Dynamically grab the role from the CSV (default to STUDENT if blank)
  const userRole =
    row.role && row.role.toUpperCase() === "FACULTY"
      ? "FACULTY"
      : "STUDENT";

  await prisma.user.create({
    data: {
      name: row.name, 
      email: row.email,
      role: userRole,
      profilePic: "",

      // If STUDENT → create studentProfile
      ...(userRole === "STUDENT" && {
        studentProfile: {
          create: {
            rollNumber: row.rollNumber || "",
            department: row.department || "",
            designation: row.program || "",   // keep this since your schema uses it
          }
        }
      }),

      // If FACULTY → create facultyProfile
      ...(userRole === "FACULTY" && {
        facultyProfile: {
          create: {
            department: row.department || "",
            designation: row.designation || "",
          }
        }
      })
    }
  });
}

          // Delete the temporary file created by Multer
          fs.unlinkSync(req.file.path);

          // Send the success response so your frontend refreshes!
          res.json({ success: true, message: "Users uploaded successfully" });

        } catch (dbError) {
          console.error("Database error:", dbError);
          res.status(500).json({ error: "Error saving records to database" });
        }
      });

  } catch (err) { 
    console.error(err); 
    res.status(500).json({ error: "Upload failed" }); 
  } 
};


exports.updateUser = async (req, res) => {
  try {
    // 1. Security check
    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({"Error":"Unauthorised"});
    }

    const { id } = req.params;
    const { name, email, role, roll, program, dept, designation1 } = req.body;

    // 2. Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        email: email,
        
        // Update nested student profile if role is STUDENT
        ...(role === "STUDENT" && {
          studentProfile: {
            update: {
              rollNumber: roll,
              department: dept,
              designation: program
            }
          }
        }),

        // Update nested faculty profile if role is FACULTY
        ...(role === "FACULTY" && {
          facultyProfile: {
            update: {
              department: dept,
              designation: designation1
            }
          }
        })
      },
      include: { studentProfile: true, facultyProfile: true }
    });

    res.status(200).json({ success: true, user: updatedUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user" });
  }
};