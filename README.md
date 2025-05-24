# LaTeX-Style Resume Builder

A modern, single-page web application that allows users to create professional resumes with LaTeX-style formatting. The app provides a real-time preview and PDF download functionality, perfect for creating clean, academic-style resumes.

## Features

### 🎨 **LaTeX-Style Formatting**
- Clean, professional typography mimicking LaTeX/Overleaf output
- Serif fonts (Computer Modern, Times New Roman fallback)
- Proper spacing and margins optimized for print
- Left-aligned section headers with underlines
- No borders or unnecessary styling elements

### 📝 **Comprehensive Form Sections**
- **Personal Information**: Name, email, phone, LinkedIn, GitHub, CodeChef, LeetCode
- **Professional Summary**: Brief overview of qualifications
- **Education**: Degree, field, university, graduation year, location
- **Experience**: Job title, company, location, duration, bullet points
- **Projects**: Project name, technologies used, achievements
- **Skills**: Organized by categories (Programming Languages, Frameworks, etc.)

### 🔄 **Real-Time Preview**
- Instant updates as you type
- Side-by-side form and preview layout
- Live formatting applied to match LaTeX output
- Responsive design for different screen sizes

### 📄 **PDF Export**
- High-quality PDF generation using html2pdf.js
- A4/Letter paper dimensions
- Printer-ready output
- Maintains LaTeX-style formatting in PDF
- Adjustable render scale for balancing quality and file size

### ⚡ **Dynamic Content Management**
- Add/remove multiple education entries
- Add/remove multiple work experiences
- Add/remove multiple projects
- Add/remove multiple skill categories
- Automatic bullet point formatting

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download or clone the repository
2. Open `index.html` in your web browser
3. Start building your resume!

### Usage

#### 1. **Personal Information**
Fill in your basic contact details including social coding profiles:
- Full Name
- Email and Phone
- LinkedIn profile
- GitHub username
- CodeChef profile
- LeetCode profile

#### 2. **Professional Summary**
Write a brief 2-3 sentence summary of your professional background and key qualifications.

#### 3. **Education**
Add your educational background:
- Use "Add Education" to include multiple degrees
- Include degree type, field of study, university, graduation year, and location
- Remove entries with the "Remove" button

#### 4. **Experience**
Detail your work experience:
- Job title and company name
- Location and duration of employment
- Bullet points describing responsibilities and achievements
- Each bullet point should start on a new line
- You can use •, -, or * symbols (they'll be automatically formatted)

#### 5. **Projects**
Showcase your key projects:
- Project name and technologies used
- Description and achievements as bullet points
- Highlight technical skills and impact

#### 6. **Skills**
Organize your skills by category:
- Create categories like "Programming Languages", "Frameworks", "Tools"
- List skills separated by commas
- Add multiple categories as needed

#### 7. **PDF Download**
- Click "Download PDF" to generate a high-quality PDF
- The PDF maintains LaTeX-style formatting
- Optimized for printing on standard paper sizes

#### Formatting Text

You can use basic HTML tags within the input fields for formatting:

- Use `<b>Text</b>` for **bold** text.
- Use `<i>Text</i>` for *italic* text.
- You can combine them, for example, `<b><i>Text</i></b>` for **_bold and italic_** text.

## Technical Details

### Built With
- **HTML5**: Semantic structure and accessibility
- **CSS3**: LaTeX-inspired styling with responsive design
- **Vanilla JavaScript**: Dynamic functionality and real-time updates
- **html2pdf.js**: Client-side PDF generation

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- Lightweight (single HTML file)
- No external dependencies except html2pdf.js
- Real-time rendering optimizations
- Efficient DOM manipulation

## File Structure
```
resume-builder/
│
├── index.html          # Main application file
├── style.css           # CSS styles
├── script.js           # JavaScript functions
└── README.md           # Documentation
```

## Styling Details

The resume preview uses carefully crafted CSS to mimic LaTeX typography:

- **Fonts**: Computer Modern (primary), Times New Roman (fallback), serif
- **Font Sizes**: 11pt body text, 24pt name, 14pt section headers
- **Spacing**: LaTeX-style margins and line heights
- **Layout**: 8.5" × 11" page dimensions
- **Typography**: Bold section headers, italic company names, proper bullet points

## Print Optimization

The application includes specific print styles:
- Hides form section when printing
- Optimizes margins for standard paper
- Ensures proper page breaks
- Maintains typography and spacing

## Responsive Design

- **Desktop**: Side-by-side form and preview
- **Tablet/Mobile**: Stacked layout with full-width sections
- **Print**: Optimized for paper output

## Contributing

This is a self-contained project built for ease of use and deployment. To enhance the application:

1. Modify the CSS in the `<style>` section for styling changes
2. Update JavaScript functions for new features
3. Maintain the single-file structure for portability

## Tips for Best Results

### Content Guidelines
- Keep bullet points concise and action-oriented
- Use consistent date formats (e.g., "Jan 2023 - Present")
- Quantify achievements when possible
- Proofread carefully before generating PDF

### Formatting Tips
- Start bullet points with action verbs
- Use parallel structure in lists
- Keep sections balanced in length
- Maintain consistent terminology

### PDF Quality
- Preview thoroughly before downloading
- Check for proper page breaks
- Ensure all content fits appropriately
- Test printing on actual paper

## License

This project is open source and available under the MIT License.

## Acknowledgments

- LaTeX community for typography inspiration
- html2pdf.js developers for PDF generation capability
- Modern web standards for making client-side applications possible

---

**Ready to create your professional resume?** Open `index.html` and start building! 