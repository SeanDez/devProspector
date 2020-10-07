import envTyped from '../shared/envVariablesTyped';

const { PORTFOLIO_LINK } = envTyped;

type employCodeOption = 'R' | 'S' | 'T';

export default (firstName: string, employeeRoleCode: employCodeOption,
  companyName: string, introCompliment: string) => {
  /* eslint-disable no-param-reassign */
  employeeRoleCode = employeeRoleCode.toUpperCase() as employCodeOption;

  if (employeeRoleCode === 'S') {
    employeeRoleCode = 'T';
  }

  const messageBodies = {
    R: `Hi ${firstName},

    ${introCompliment} By the way, ${companyName} is hiring right now, right? Would you consider me as a Full Stack JS developer? Here's a link to my work: ${PORTFOLIO_LINK}.
    
    If you like what you see and there's a need I'd love to schedule a time to talk about this further. Let me know!`,
    S: '', // unused for now
    T: `Hi ${firstName},
  
    ${introCompliment} By the way, I'm looking for the right person to talk to at ${companyName} to get hired as a full stack JS dev. Do you know who to contact? 
    
    Alternatively you can pass my info to them. mrseandezoysa@gmail.com is my email. And here's my portfolio link with resume page: ${PORTFOLIO_LINK}`,
  };

  return messageBodies[employeeRoleCode];
};
