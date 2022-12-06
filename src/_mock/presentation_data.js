const presentationData = {
  id: 1,
  code: 123456,
  title: 'Midterm quiz',
  createdBy: 123,
  createdAt: new Date(),
  slides: [
    {
      id: 0,
      question: 'Who is the .....?',
      options: [
        { id: 1, content: 'Person 1', isCorrect: true, players: [1, 2, 3] },
        { id: 2, content: 'Person 2', isCorrect: false, players: [4, 5, 6] },
        { id: 3, content: 'Person 3', isCorrect: false, players: [6, 7, 8] }
      ]
    },
    {
      id: 1,
      question: 'What is the .....?',
      options: [
        { id: 1, content: 'sdf 1', isCorrect: true, players: [1, 2, 3] },
        { id: 2, content: 'sfd 2', isCorrect: false, players: [4, 5, 6] },
        { id: 3, content: 'sdf 3', isCorrect: false, players: [6, 7, 8] }
      ]
    }
  ]
};

export default presentationData;
