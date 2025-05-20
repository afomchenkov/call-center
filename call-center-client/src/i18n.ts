import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          systemStatus: 'System Status',
          dashboard: 'Dashboard',
          system: {
            title: 'System Status',
            activeCalls: 'Active Calls',
            activeMessages: 'Active Messages',
            completedTasks: 'Completed Tasks',
            queuedTickets: 'Queued tickets',
            noQueuedTickets: 'No queued tickets...',
          },
          ticketsQueue: {
            title: 'Ticket Queue',
            voice: 'Voice',
            text: 'Text',
            allTickets: 'All',
            queuedTickets: 'Queued tickets',
            noTickets: 'No tickets in queue...',
            queued: 'Queued',
            tickets: 'Tickets',
          },
          agentWorkload: {
            title: 'Agent Workload',
            noAgents: 'No agents available...',
            languages: 'Languages',
            tasks: 'Tasks'
          },
          activeAgents: {
            title: 'Active Agents',
            noAgents: 'No active agents...',
            languages: 'Languages',
            calls: 'Calls',
            messages: 'Messages',
            capacity: 'Capacity',
          },
          agents: 'Agents',
          resetSystem: 'Reset System',
          assignTicket: 'Assign Ticket',
          callCenter: 'Call Center System',
          registerAgent: {
            addNewAgent: 'Add New Agent',
            name: 'Name',
            languageSkills: 'Language Skills',
            addLanguage: 'Add Language',
            save: 'Save'
          }
        },
      },
      de: {
        translation: {
          welcome: 'Willkommen',
          systemStatus: 'Systemstatus',
          dashboard: 'Dashboard',
          system: {
            title: 'Systemstatus',
            activeCalls: 'Aktive Anrufe',
            activeMessages: 'Aktive Nachrichten',
            completedTasks: 'Abgeschlossene Aufgaben',
            noQueuedTickets: 'Keine Warteschlangentickets...',
          },
          ticketsQueue: {
            title: 'Ticket-Warteschlange',
            voice: 'Sprachticket',
            text: 'Textticket',
            allTickets: 'Alle',
            queuedTickets: 'Tickets in der Warteschlange',
            noTickets: 'Keine Tickets in der Warteschlange',
            queued: 'in der Warteschlange',
            tickets: 'Tickets',
          },
          agentWorkload: {
            title: 'Agentenarbeitslast',
            noAgents: 'Keine Agenten verfügbar...',
            languages: 'Sprachen',
            tasks: 'Tasks'
          },
          activeAgents: {
            title: 'Wirkstoffe',
            noAgents: 'Keine Wirkstoffe...',
            languages: 'Sprachen',
            calls: 'Anrufe',
            messages: 'Nachrichten',
            capacity: 'Kapazität',
          },
          agents: 'Agenten(innen)',
          resetSystem: 'System zurücksetzen',
          assignTicket: 'Ticket zuweisen',
          callCenter: 'Callcenter-System',
          registerAgent: {
            addNewAgent: 'Neuen Agenten hinzufügen',
            name: 'Name',
            languageSkills: 'Sprachkenntnisse',
            addLanguage: 'Sprache hinzufügen',
            save: 'Speichern'
          }
        },
      },
    },
  });

export default i18n;
