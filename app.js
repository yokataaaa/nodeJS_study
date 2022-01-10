'use strict';

const express = require('express');
// let members = require('./members');
// db
const db = require('./models/index');
const { Member } = db;

const app = express();

// middleware 
app.use((req, res, next) => {
  console.log(req.query);
  next();
});
app.use(express.json());

// router API
app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    // const teamMembers = members.filter((m) => m.team === team);
    const teamMembers = await Member.findAll({
      where: { team },
    });
    res.send(teamMembers);
  }
  else {
    const members = await Member.findAll();
    res.send(members);
  }
});

app.get('/api/members/order', async (req, res) => {
  const { team } = req.query;
  if (team) {
    // const teamMembers = members.filter((m) => m.team === team);
    const teamMembers = await Member.findAll({
      where: { team },
      order: [['admissionDate','DESC']],
    });
    res.send(teamMembers);
  }
  else {
    const members = await Member.findAll({ order: [['admissionDate','DESC']], });
    res.send(members);
  }
});

app.get('/api/members/:id', async (req, res) => {
  // const id = req.params.id;
  const { id } = req.params;
  // const member = members.find((m) => m.id === Number(id));
  const member = await Member.findOne({ where: { id: id } });
  if (member) {
    console.log(member);
    res.send(member);
  }
  else {
    res.status(404).send({message: 'There is no such member'});
  }
});

app.get('/hello', (req, res) => {
  res.send('<h1>Hello Express!</h1>');
});

app.post('/api/members', async (req, res) => {
  // console.log(req.body);
  const newMember = req.body;
  // members.push(newMember);
  const member = Member.build(newMember);
  await member.save();
  res.send(newMember);
});

app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  // const member = members.find((m) => m.id === Number(id));
  const result = await Member.update(newInfo, { where: { id: id } });
  // const member = await Member.findOne({ where: { id: id } });
  // if (member) {
  //   Object.keys(newInfo).forEach((prop) => {
  //     member[prop] = newInfo[prop];
  //   });
  //   await member.save();
  //   res.send(member);
  // }
  console.log(result);
  if (result[0]) {
    res.send({ message: `${result[0]} row(s) affected` });
  }
  else {
    res.status(404).send({ message: 'There is no member with the id' });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  // const membersCount = members.length;
  // members = members.filter((member) => member.id !== Number(id));
  // if (members.length < membersCount) {
  //   res.send({ message: 'Deleted' });
  // }
  const deletedCount = await Member.destroy({ where: { id: id } });
  console.log(deletedCount);
  if (deletedCount) {
    res.send({ message: `${deletedCount} row(s) deleted` });
  }
  else {
    res.status(404).send({ message: 'There is no member with the id'});
  }
});

app.listen(3000, () => {
  console.log('Server is listening....');
});