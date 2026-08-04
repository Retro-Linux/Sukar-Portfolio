import { defineField, defineType } from 'sanity';

export const messageType = defineType({
  name: 'message',
  title: 'Messages',
  type: 'document',
  fieldsets: [
    {
      name: 'senderDetails',
      title: 'Sender Information',
      options: { columns: 2 },
    },
    {
      name: 'meta',
      title: 'Status & Metadata',
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      readOnly: true,
      fieldset: 'senderDetails',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      fieldset: 'senderDetails',
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'message',
      title: 'Message Content',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      fieldset: 'meta',
      options: {
        list: [
          { title: 'Unread', value: 'unread' },
          { title: 'Read', value: 'read' },
          { title: 'Replied', value: 'replied' },
        ],
        layout: 'radio',
      },
      initialValue: 'unread',
    }),
    defineField({
      name: 'createdAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
      fieldset: 'meta',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'subject',
      subtitle: 'name',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      const statusIcon = status === 'unread' ? '🟢' : status === 'replied' ? '✅' : '⚪';
      return {
        title: title || 'No Subject',
        subtitle: `${statusIcon} From: ${subtitle || 'Unknown'}`,
      };
    },
  },
});
