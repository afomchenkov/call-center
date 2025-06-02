import axios from 'axios';
import { vi, it, describe, expect } from 'vitest';
import { getAgent, getAgents, createAgent } from './agent.service';
// import { getQueueStatus } from './queue.service';
// import { assignTask, completeTask, getCompletedTasks } from './tasks.service';

vi.mock('axios');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AxiosStatic = any;

const mockedAxios = axios as jest.Mocked<AxiosStatic>;

const defaultAgents = [
  {
    id: '7462e519-f364-4d27-917c-c1a6d1412037',
    name: 'John Smith',
    language_skills: ['English', 'German'],
    assigned_tasks: [
      {
        id: 'a3067e3b-bbc8-45cd-b0b2-d9487f10934f',
        platform: 'call',
      },
      {
        id: '8ab77000-37e3-4d63-9582-f8a066833aa4',
        platform: 'facebook_chat',
      },
    ],
  },
  {
    id: 'ca9efbc1-eb67-4465-9454-ba87221bc1c2',
    name: 'Max Mustermann',
    language_skills: ['French', 'German'],
    assigned_tasks: [
      {
        id: 'b5db6b1d-c6a1-406a-a263-35c160cfa9c3',
        platform: 'website_chat',
      },
    ],
  },
];

describe('Agent service tests', () => {
  it('should get agents', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        agents: [...defaultAgents],
      },
    });

    const result = await getAgents();
    const agents = result.unwrap().agents;
    expect(agents.length).toBe(2);
    expect(agents).toMatchObject(defaultAgents);
  });

  it('should create agent', async () => {
    const defaultUser = { ...defaultAgents[0] };
    defaultUser.assigned_tasks = [];

    const defaultCreateAgentPayload = {
      name: defaultUser.name,
      language_skills: defaultUser.language_skills,
    };

    mockedAxios.post.mockResolvedValueOnce(defaultUser);
    await createAgent(defaultCreateAgentPayload);

    expect(mockedAxios.post.mock.calls).toHaveLength(1);
    const payload = JSON.parse(mockedAxios.post.mock.calls[0][1]);
    expect(payload).toMatchObject(defaultCreateAgentPayload);
  });

  it('should get agent', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: defaultAgents[0],
    });

    const result = await getAgent('7462e519-f364-4d27-917c-c1a6d1412037');
    const agent = result.unwrap();
    expect(agent).toMatchObject(defaultAgents[0]);
  });
});
