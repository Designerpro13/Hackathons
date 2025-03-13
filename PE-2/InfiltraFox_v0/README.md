# **InfiltraFox** 🦊 – A Pentester's Browser Extension

## Overview

InfiltraFox is a **Firefox browser extension** designed for security professionals to conduct **rapid web security assessments**. It analyzes webpage HTML to identify potential security vulnerabilities and provides actionable recommendations for both offensive and defensive security approaches.

## Key Features

- **Real-time Vulnerability Detection**
  - **SQL Injection (SQLi)**: Identifies vulnerable form inputs and login pages
  - **Cross-Site Scripting (XSS)**: Detects unsafe script contexts and DOM injection points
  - **Cookie Security**: Analyzes cookie attributes (HttpOnly, Secure, SameSite)

- **Dual-Mode Interface**
  - **Red Team Mode**: Suggests exploitable attack vectors and pentesting techniques
  - **Blue Team Mode**: Provides defensive recommendations and security hardening measures

- **Security Analysis Tools**
  - HTML source scanning with intelligent pattern matching
  - Form and input field analysis
  - Script execution context evaluation
  - Cookie security attribute verification

## Installation

### Development Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/infiltrafox.git
   cd infiltrafox
   ```

2. Load the extension in Firefox:
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Click **Load Temporary Add-on**
   - Select the `manifest.json` file from the project's `src` folder

### Regular Installation
*Coming soon to Firefox Add-ons*

## Usage Guide

1. **Access the Tool**: Click the InfiltraFox icon in your browser toolbar
2. **Scan the Current Page**: Click "Analyze Page" to begin scanning
3. **Review Findings**: Browse through tabs for different vulnerability types:
   - SQL Injection risks
   - XSS vulnerabilities
   - Cookie security issues
4. **Toggle Analysis Mode**:
   - Red Team: See offensive tactics and exploitation vectors
   - Blue Team: View defensive recommendations and remediation steps
5. **Export Results**: Save findings as a JSON report (optional)

## Technical Architecture

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Extension Framework**: Firefox WebExtensions API
- **Analysis Engine**: Custom JavaScript vulnerability detection algorithms
- **Scanning Components**:
  - Regex pattern matching for vulnerability signatures
  - DOM traversal for dynamic content analysis
  - Cookie property inspection
  - Form input field analysis

## Use Cases

- **Security Professionals**: Rapid assessment during penetration testing engagements
- **Bug Bounty Hunters**: Quickly identify potential attack vectors on target websites
- **Web Developers**: Security-focused QA testing during development
- **Security Educators**: Hands-on demonstration of web security concepts
- **CTF Competitors**: Fast reconnaissance of web challenges

## Roadmap

- [ ] Enhanced XSS payload detection for DOM-based vulnerabilities
- [ ] Integration with OWASP attack patterns database
- [ ] Automated report generation with severity scoring
- [ ] Machine learning-based false positive reduction
- [ ] Custom vulnerability rule creation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact & Support

- **Project Lead**: [Paarth Vakharia](https://github.com/Designerpro13)
- **Report Issues**: Submit via GitHub issues
- **Feature Requests**: Open an issue with the tag "enhancement"

---

*InfiltraFox is intended for authorized security testing and educational purposes only. Always obtain proper permission before scanning websites you don't own.*
