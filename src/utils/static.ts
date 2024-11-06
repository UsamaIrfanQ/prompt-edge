export const staticCompanyMarkdownText = `**Mizkan Holdings Co., Ltd.**

Mizkan Holdings Co., Ltd. is a Japanese company specializing in the production of condiments and sauces, most notably vinegars, mustards, dressings, and other seasoning products. Founded in 1804 by Matazaemon Nakano I in Handa City, Aichi Prefecture, Mizkan has grown from a small vinegar producer to a global enterprise.

---

**Are you implementing Dynamics 365 at Mizkan Holdings or a subsidiary?**`;

export const staticBusinessProcessesData = {
  title: 'Mizkan America Inc. → Business Processes',
  description:
    'Mizkan America Inc. is a North American company that is part of a global food manufacturer and may require the following business processes to transform the business. Please select the business processes to refine the scope of this project.',
  processes: [
    {
      title: 'Record to Report',
      description:
        'Process involving Financial management, Consolidations and Management Reporting, AR, AP & Budgeting',
    },
    {
      title: 'Procure to Pay',
      description:
        'Process involving purchase catalogs, purchase req, and purchase orders management',
    },
    {
      title: 'Order to Cash',
      description:
        'Process involving Customer / Prospect Management, Sales Quote and Order management',
    },
    {
      title: 'Acquire to Retire',
      description:
        'Process involving acquisition of Fixed assets, Retirement, Upgrade and Financial Accounting of the Assets',
    },
    {
      title: 'Produce to Store',
      description:
        'Process involving Material Planning, Forecasting, Production Order processing, Warehouse management activities, and Shipping',
    },
    {
      title: 'Project to Revenue',
      description:
        'Process involving Project Contracts, Project Plans, Project Invoicing and Revenue Recognition',
    },
    {
      title: 'Inbound to Outbound',
      description:
        'Process involving Transportation Management, Compliance, Routes and Loads',
    },
    {
      title: 'Hire to Retire',
      description:
        'Process involving Human Resources Management, Onboarding to Retiring, and Payroll',
    },
  ],
};

export const staticMigrationsData = [
  {
    title: 'Master Data',
    items: [
      {
        id: 'customer',
        label: 'Customer Data:',
        value: 'Over 1000 customers',
        isChecked: true,
      },
      {
        id: 'vendor',
        label: 'Vendor Supplier Data:',
        value: '~ 560 vendors',
        isChecked: true,
      },
      {
        id: 'product',
        label: 'Product / Item Master',
        value: 'Over 200 items',
        isChecked: true,
      },
      {
        id: 'chart',
        label: 'Chart of Accounts',
        value: 'Standard',
        isChecked: true,
      },
    ],
  },
  {
    title: 'Open Transactions',
    items: [
      {
        id: 'salesOrder',
        label: 'Open Sales Order:',
        value: '',
        isChecked: false,
      },
      {
        id: 'purchaseOrder',
        label: 'Open Purchase Order:',
        value: '',
        isChecked: false,
      },
      { id: 'invoices', label: 'Open Invoices:', value: '', isChecked: false },
      {
        id: 'inventory',
        label: 'Inventory Balance:',
        value: '',
        isChecked: false,
      },
    ],
  },
];

export const applicationModuleData = [
  {
    title: 'Dynamics 365 Finance',
    items: [
      {
        id: 1,
        label: 'Accounts Receivable (AR)',
        description:
          'Manages customer invoices, collections, and credit controls.',
        isChecked: true,
      },
      {
        id: 2,
        label: 'Budgeting & Forecasting',
        description:
          'Enables creation and management of budgets and forecasts.',
        isChecked: true,
      },
      {
        id: 3,
        label: 'Fixed Assets Management',
        description: 'Tracks asset lifecycle from acquisition to disposal.',
        isChecked: true,
      },
      {
        id: 4,
        label: 'Cash and Bank Management',
        description:
          'Oversees bank accounts, cash positions, and reconciliations.',
        isChecked: true,
      },
    ],
  },
  {
    title: 'Dynamics 365 Supply Chain',
    items: [
      {
        id: 5,
        label: 'Master Planning',
        description:
          'Facilitates demand forecasting, material requirements planning (MRP), and capacity planning.',
        isChecked: false,
      },
      {
        id: 7,
        label: 'Transportation Management',
        description:
          'Handles transportation planning, carrier management, and freight reconciliation.',
        isChecked: false,
      },
      {
        id: 8,
        label: 'Product Information Management',
        description:
          'Centralizes product data management, including specifications and documentation.',
        isChecked: true,
      },
    ],
  },
];

export const erpPlatformData = [
  {
    title: 'Dynamics 365 Finance & Supply Chain',
    description:
      'Designed for medium to large organizations with complex and global operations. Suitable for manufacturing, distribution, retail, and other industries requiring advanced functionalities.',
    isChecked: true,
    items: [],
  },
  {
    title: 'Dynamics 365 Business Central',
    description:
      'Geared towards organizations that are outgrowing basic accounting software but do not require the complexity of an enterprise-level ERP. Serves a variety of industries but with less depth in industry-specific functionalities.',
    isChecked: false,
    items: [],
  },
];

export const staticCompanyResponse = {
  input: 'Tell me about tesla',
  chat_id: '20241104152350-fadc35d88e62',
  user_id: 'testing',
  response:
    '{"response": [{"id": "1", "user_id": "1", "viewType": "companyinfo", "title": "Tesla, Inc.", "content": "Tesla is accelerating the world\\u2019s transition to sustainable energy with electric cars, solar and integrated renewable energy solutions for homes. Tesla\'s mission is to accelerate the world\\u2019s transition to sustainable energy. Today, Tesla builds not only all-electric vehicles but also infinitely scalable clean energy generation and storage products. Built for any adventure, Cybertruck has a durable exterior, spacious interior and technological capabilities. Tesla\'s name is a tribute to inventor and electrical engineer Nikola Tesla. In February 2004, Elon Musk joined as Tesla\\u2019s largest shareholder; in 2008, he was named CEO.", "industry": "Automotive", "SIC_Code": "", "type_of_manufacturing": "Electric vehicles, energy storage, and solar panels", "headquarters_address": "3500 Deer Creek Road, Palo Alto, CA 94304, United States", "employees": "70757", "corporate_structure": "Public", "subsidiaries_and_brands": ["TESLA Semiconductors", "Elon Musk, Tesla, SpaceX News by Tesla Oracle", "Yes Energy | TESLA Forecasting Solutions", "Tesla Marca\\u00e7\\u00f5es Industriais", "Tesla Power USA", "Tesla Outsourcing Services", "Diagn\\u00f3stico Tesla SRL", "Tesla Energy"]}]}',
};
