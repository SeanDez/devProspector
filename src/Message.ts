export default class Message {
  private portfolioLink: string = '';

  public recruiterColdOpen(firstName: string, introCompliment: string): string {
    return `Hi ${firstName},

${introCompliment}

I saw that is hiring web developers, and I wanted to see whether I was a good fit. I am a fullstack engineer that has worked on several mid complexity web apps; here's a link to my work: ${this.portfolioLink}.

I was wondering if I could demonstrate my technical expertise via a coding challenge, or hop on a phone call to see if I was a good fit for a full stack developer role?`;
  }

  public engineerColdOpen(firstName: string,
    introCompliment?: string, companyName?: string): string {
    return `Hi ${firstName},

${introCompliment}

I see ${companyName} is reopening hiring of full web stack developers. I have a portfolio with projects in Typescript, React.js and Express.js with PostgreSQL; maybe my skills are a good fit: ${this.portfolioLink}.

Would you be able to pass me through your network to a higher-up, or possibly a recruiter who could consider me?`;
  }

  public salesmanColdOpen(firstName: string,
    introCompliment?: string, companyName?: string): string {
    return this.engineerColdOpen(firstName, introCompliment, companyName);
  }
}
