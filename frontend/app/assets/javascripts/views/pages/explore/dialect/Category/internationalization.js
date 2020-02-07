const copy = {
  detail: {
    isTrashed: 'This category has been deleted',
    description: 'Category description',
    name: 'Category name',
    title: 'Category',
    parent: 'Parent category',
  },
  create: {
    btnBack: '< Back',
    description: 'Category description',
    parent: 'Parent category',
    name: 'Category name *',
    requiredNotice: 'All fields with an asterisk are required',
    submit: 'Create new category',
    title: 'Create a new category',
    isConfirmOrDenyTitle: 'Delete category?',
    btnInitiate: 'Delete',
    btnDeny: 'No, do not delete the category',
    btnConfirm: 'Yes, delete the category',
    success: {
      linkCreateAnother: 'Create a new category',
      detailView: 'Detail page',
      browseView: 'Browse all categories',
      editView: 'Edit',
      noName: '(No name)',
      thanks: 'Thanks for creating a category. Your contributions help make the site better!',
      title: 'We created a new category',
      review: 'Here is what you submitted:',
    },
  },
  edit: {
    btnBack: '< Back',
    btnConfirm: 'Yes, delete the category',
    btnDeny: 'No, do not delete the category',
    btnInitiate: 'Delete',
    parent: 'Parent category',
    description: 'Category description',
    isConfirmOrDenyTitle: 'Delete category?',
    isTrashed: 'This category has been deleted and can not be edited',
    name: 'Category name *',
    requiredNotice: 'All fields with an asterisk are required',
    success: {
      linkCreateAnother: 'Create a new category',
      noName: '(No name)',
      thanks: 'Thanks for updating a category. Your contributions help make the site better!',
      title: 'We updated the category',
      review: 'Here is what you submitted:',
    },
    successDelete: {
      title: 'We deleted the category',
    },
    submit: 'Edit category',
    title: 'Edit a category',
  },
  errorBoundary: {
    explanation: "Sorry about this, but we can't create any new categories at the moment.",
    explanationEdit: "Sorry about this, but we can't edit any new categories at the moment.",
    optimism: 'The issue should be fixed shortly.',
    title: 'We encountered a problem',
  },
  loading: 'Loading',
  validation: {
    name: 'Please provide a name for the category',
  },
}
export default copy
