let express = require('express');
let { sequelize } = require('./lib/index');
let { course } = require('./models/course.model');
let { student } = require('./models/student.model');
let app = express();

app.use(express.json());

// Data
let courses = [
  { title: 'Math 101', description: 'Basic Mathematics' },
  { title: 'History 201', description: 'World History' },
  { title: 'Science 301', description: 'Basic Sciences' },
];

let students = [{ name: 'John Doe', age: 24 }];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await course.bulkCreate(courses);

    await student.bulkCreate(students);

    return res.status(200).json({ message: 'Database seeding successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1
async function addNewStudent(newStudent) {
  let newData = await student.create(newStudent);

  return { newData };
}

app.post('/students/new', async (req, res) => {
  try {
    let newStudent = req.body.newStudent;
    let response = await addNewStudent(newStudent);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2
async function updateStudentById(newStudentData, id) {
  let studentDetails = await student.findOne({ where: { id } });

  if (!studentDetails) {
    return {};
  }

  studentDetails.set(newStudentData);
  let updatedData = await studentDetails.save();

  return { message: 'Student updated successfully', updatedData };
}

app.post('/students/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newStudentData = req.body;
    let response = await updateStudentById(newStudentData, id);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Port
app.listen(3000, () => {
  console.log();
});
