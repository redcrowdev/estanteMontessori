//File Requirements
const mongoose = require('mongoose');
const Activity = require('../models/activity.js');

//DB Connection
mongoose.connect('mongodb://localhost:27017/estanteMontessori', {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log('Database Connected');
});

//Seeds
const activitySeeds = [
   {
      title: 'Jogo do Vocabulário',
      ages: '2-6',
      sensiblePeriod: 'Linguagem',
      category: '',
      theme: 'Vocabulário',
      description: 'Apresentação de figuras com a articulação do nome daquilo que representam e posterior questionamento à criança se ela lembra o nome do objeto/figura representado no cartão.',
      owned: true
   },
   {
      title: 'Manipulação de Objetos',
      ages: '1-5',
      sensiblePeriod: 'Detalhes',
      category: '',
      theme: '',
      description: 'Apresentação de objetos à criança, permitindo a manipulação e observação de suas características.',
      owned: true
   },
   {
      title: 'Clean Up',
      ages: '2-4',
      sensiblePeriod: 'Ordem',
      category: '',
      theme: '',
      description: 'Estimular a criança a guardar os brinquedos e utensílios após sua utilização, atentando para os lugares corretos de guarda.',
      owned: true
   },
   {
      title: 'Ensinamento Prático',
      ages: '2-6',
      sensiblePeriod: 'Graça e Cortesia',
      category: '',
      theme: 'Vida Prática',
      description: 'Convidar a criança para desenvolver uma atividade cotidiana, como lavar a louça, explicando a situação, o que deve ser feito e observando o desenvolvimento desta atividade por ela.',
      owned: true
   },
   {
      title: 'Jogo dos Cheiros',
      ages: '3-5',
      sensiblePeriod: 'Refinamento dos Sentidos',
      category: '',
      theme: 'Acuidade Sensorial - Olfato',
      description: 'Apresentar à criança diversas fontes de aromas (ervas, temperos, etc), separadamente, convidando-a a sentir o cheiro, falando o nome de cada coisa e perguntando o que ela achou de cada um.',
      owned: true
   },
   {
      title: 'Pareamento de Cores, Figuras e Formas',
      ages: '3-5',
      sensiblePeriod: 'Refinamento dos Sentidos',
      category: '',
      theme: 'Acuidade Sensorial - Visão',
      description: 'Apresentar cartões com figuras ou objetos duplicados ou de cores iguais para que a criança identifique as relações de igualdade e agrupe-os de acordo com essa percepção.',
      owned: true
   },
   {
      title: 'Letras de Lixa',
      ages: '3-5',
      sensiblePeriod: 'Escrita',
      category: '',
      theme: 'Desenvolvimento da Escrita',
      description: 'Conjunto de cartões com as letras do alfabeto desenhadas em forma cursiva com lixa fina, possibilitando que a criança trace os signos com os dedos ao tempo que "sente" como ele é escrito.',
      owned: true,
   }
   // {
   //    title:,
   //    ages:,
   //    sensiblePeriod:,
   //    category:,
   //    theme:,
   //    description:,
   //    owned:,
   //    picture:
   // },   
]

const seedDB = async () => {
   await Activity.deleteMany({});
   await Activity.insertMany(activitySeeds);
}

seedDB().then(() => {
   mongoose.connection.close();
})