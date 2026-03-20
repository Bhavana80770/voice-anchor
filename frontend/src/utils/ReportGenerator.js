import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateTherapistReport = (child, sessions, insights, notes) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(31, 41, 55); // Dark background like the app
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('Voice Anchor — Clinical Report', 20, 25);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 70, 25);

  // Child Info Section
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.text('Patient Information', 20, 55);
  
  doc.setLineWidth(0.5);
  doc.line(20, 58, pageWidth - 20, 58);

  doc.setFontSize(12);
  doc.text(`Name: ${child.childName}`, 20, 68);
  doc.text(`Age: ${child.age}`, 20, 75);
  doc.text(`Favorite Thing: ${child.favoriteThing}`, 20, 82);
  doc.text(`Last Active: ${child.lastActive}`, 20, 89);

  // AI Insights Section
  doc.setFontSize(16);
  doc.text('AI Behavioral Insights', 20, 105);
  doc.line(20, 108, pageWidth - 20, 108);

  doc.setFontSize(11);
  doc.text(`Top Routine: ${insights.topRoutine || 'N/A'}`, 20, 118);
  doc.text(`Preferred Language: ${insights.dominantLanguage || 'N/A'}`, 20, 125);
  doc.text(`Dominant Emotion: ${insights.dominantEmotion || 'N/A'}`, 20, 132);
  doc.text(`Total Sessions Logged: ${sessions.length}`, 20, 139);

  // Clinical Notes Section
  doc.setFontSize(16);
  doc.text('Clinical Observations', 20, 155);
  doc.line(20, 158, pageWidth - 20, 158);

  if (notes && notes.length > 0) {
    const noteData = notes.map(n => [n.date, n.text]);
    doc.autoTable({
      startY: 165,
      head: [['Date', 'Observation / Management Note']],
      body: noteData,
      theme: 'grid',
      headStyles: { fillColor: [99, 179, 237] }
    });
  } else {
    doc.setFontSize(10);
    doc.text('No clinical notes documented for this period.', 20, 165);
  }

  // Session History Table
  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 165) + 20;
  doc.setFontSize(16);
  doc.text('Recent Session History', 20, finalY);
  doc.line(20, finalY + 3, pageWidth - 20, finalY + 3);

  const sessionData = sessions.slice(0, 15).map(s => [
    s.time || 'N/A', 
    s.routine || 'Manual', 
    s.emotion || 'N/A', 
    s.language || 'N/A'
  ]);

  doc.autoTable({
    startY: finalY + 10,
    head: [['Time', 'Routine', 'Emotion', 'Language']],
    body: sessionData,
    theme: 'striped',
    headStyles: { fillColor: [159, 122, 234] }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount} | Voice Anchor HIPAA Compliant Report (Simulation)`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  doc.save(`${child.childName}_Clinical_Report.pdf`);
};
