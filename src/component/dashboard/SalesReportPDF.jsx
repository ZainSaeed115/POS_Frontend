// SalesReportPDF.js
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 20 },
  table: { display: "flex", width: "100%", marginBottom: 10 },
  row: { flexDirection: "row" },
  cell: { padding: 5, fontSize: 10, border: "1px solid black" },
  headerCell: { fontWeight: 'bold', backgroundColor: '#f0f0f0' }
});

const SalesReportPDF = ({ sales, month, week, products, accounting }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Sales Report - {month} Week {week}</Text>
      
      <View style={styles.section}>
        <Text style={{fontSize: 16, marginBottom: 10}}>Summary</Text>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerCell]}>
            <Text style={[styles.cell, {width: '50%'}]}>Metric</Text>
            <Text style={[styles.cell, {width: '50%'}]}>Value</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, {width: '50%'}]}>Total Revenue</Text>
            <Text style={[styles.cell, {width: '50%'}]}>Rs {accounting.totalRevenue.toLocaleString()}</Text>
          </View>
          {/* Add more summary rows */}
        </View>
      </View>

      {/* Add more sections for products, daily sales, etc. */}
    </Page>
  </Document>
);

export default SalesReportPDF;