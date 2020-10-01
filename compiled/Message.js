"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = /** @class */ (function () {
    function Message() {
        this.portfolioLink = '';
    }
    Message.prototype.recruiterColdOpen = function (firstName, introCompliment) {
        return "Hi " + firstName + ",\n\n" + introCompliment + "\n\nI saw that is hiring web developers, and I wanted to see whether I was a good fit. I am a fullstack engineer that has worked on several mid complexity web apps; here's a link to my work: " + this.portfolioLink + ".\n\nI was wondering if I could demonstrate my technical expertise via a coding challenge, or hop on a phone call to see if I was a good fit for a full stack developer role?";
    };
    Message.prototype.engineerColdOpen = function (firstName, introCompliment, companyName) {
        return "Hi " + firstName + ",\n\n" + introCompliment + "\n\nI see " + companyName + " is reopening hiring of full web stack developers. I have a portfolio with projects in Typescript, React.js and Express.js with PostgreSQL; maybe my skills are a good fit: " + this.portfolioLink + ".\n\nWould you be able to pass me through your network to a higher-up, or possibly a recruiter who could consider me?";
    };
    Message.prototype.salesmanColdOpen = function (firstName, introCompliment, companyName) {
        return this.engineerColdOpen(firstName, introCompliment, companyName);
    };
    return Message;
}());
exports.default = Message;
