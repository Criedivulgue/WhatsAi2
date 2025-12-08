import type { Contact, Chat } from './types';

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    phone: '+1-202-555-0143',
    status: 'Active',
    avatar: 'avatar-1',
    categories: ['VIP', 'Lead'],
    interests: ['AI Development', 'UX/UI Design'],
    notes: 'Met at TechCon 2023. Interested in our enterprise plan.',
  },
  {
    id: 'contact-2',
    name: 'Marcus Chen',
    email: 'marcus.c@example.com',
    phone: '+1-202-555-0187',
    status: 'New',
    avatar: 'avatar-2',
    categories: ['New Inquiry'],
    interests: ['Data Science', 'Cloud Computing'],
    notes: 'Reached out via contact form. Follow up needed.',
  },
  {
    id: 'contact-3',
    name: 'Aisha Khan',
    email: 'aisha.k@example.com',
    phone: '+1-202-555-0121',
    status: 'Active',
    avatar: 'avatar-3',
    categories: ['Partner'],
    interests: ['DevOps', 'Cybersecurity'],
    notes: 'Technical contact at a partner company. Very knowledgeable.',
  },
  {
    id: 'contact-4',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+1-202-555-0199',
    status: 'Blocked',
    avatar: 'avatar-4',
    categories: ['Spam'],
    interests: [],
    notes: 'Marked as spam after unsolicited messages.',
  },
  {
    id: 'contact-5',
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    phone: '+1-202-555-0156',
    status: 'Active',
    avatar: 'avatar-5',
    categories: ['Customer'],
    interests: ['Web Development', 'React'],
    notes: 'Long-time customer, renewal coming up in 2 months.',
  },
   {
    id: 'contact-6',
    name: 'Ben Carter',
    email: 'ben.c@example.com',
    phone: '+1-202-555-0178',
    status: 'New',
    avatar: 'avatar-6',
    categories: ['New Inquiry'],
    interests: ['Mobile Development'],
    notes: 'Downloaded our whitepaper on mobile trends.',
  },
];

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    contact: mockContacts[0],
    messages: [
      { id: 1, name: 'Elena Rodriguez', avatar: 'avatar-1', message: "Hello! I was wondering if you could provide more details about the enterprise plan's features." },
      { id: 2, name: 'Attendant', avatar: 'avatar-1', message: 'Of course, Elena! Our enterprise plan includes advanced security, dedicated support, and unlimited API access. Are there any specific features you are interested in?' },
      { id: 3, name: 'Elena Rodriguez', avatar: 'avatar-1', message: "The dedicated support sounds great. What's the typical response time?" },
    ],
  },
  {
    id: 'chat-2',
    contact: mockContacts[1],
    messages: [
      { id: 1, name: 'Marcus Chen', avatar: 'avatar-2', message: 'Hi, I just submitted a form on your website. I have a few questions about your data science tools.' },
    ],
  },
  {
    id: 'chat-3',
    contact: mockContacts[2],
    messages: [
      { id: 1, name: 'Aisha Khan', avatar: 'avatar-3', message: "Hey team, following up on our discussion last week regarding the API integration. Any updates?" },
      { id: 2, name: 'Attendant', avatar: 'avatar-1', message: 'Hi Aisha, yes! The engineering team has pushed the latest documentation. I can send you the link.' },
    ],
  },
   {
    id: 'chat-5',
    contact: mockContacts[4],
    messages: [
      { id: 1, name: 'Olivia Martinez', avatar: 'avatar-5', message: 'My subscription is up for renewal soon. Can we discuss the new pricing?' },
      { id: 2, name: 'Attendant', avatar: 'avatar-1', message: "Absolutely, Olivia. We have some new options that I think you'll find interesting. I'm looking at your account now." },
    ],
  },
  {
    id: 'chat-6',
    contact: mockContacts[5],
    messages: [
        { id: 1, name: 'Ben Carter', avatar: 'avatar-6', message: 'I read your whitepaper and it was very insightful. I would like a demo of your product.' },
    ]
  }
];
