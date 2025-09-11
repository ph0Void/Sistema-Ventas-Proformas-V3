"use client";
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';
import {z} from "zod";
import {InvoiceSchema} from "@/schema/InvoiceSchema";
import {formatDate, formatMoney} from "@/utils/FormatHelper";
import {SellerSchema} from "@/schema/SellerSchema";

// Estilos similares a Tailwind usando StyleSheet de react-pdf
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    section: {
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 32,
        height: 32,
        marginRight: 10,
    },
    invoiceInfo: {
        textAlign: 'right',
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    semiBoldText: {
        fontWeight: 'semibold',
        fontSize: 12,
    },
    table: {
        width: 'auto',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 5,
        marginBottom: 5,
    },
    tableHeader: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tableCell: {
        width: '25%',
        paddingRight: 8,
    },
    rightAlign: {
        textAlign: 'right',
    },
    totalSection: {
        alignItems: 'flex-end',
        marginTop: 10,
        marginBottom: 20,
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        paddingTop: 10,
    },
});

interface SateItemPdf {
    title:string;
    dataInvoice: z.infer<typeof InvoiceSchema>;
    seller: z.infer<typeof SellerSchema> | null;
}

export default function InvoicePdf({dataInvoice, title, seller}: SateItemPdf) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <Image
                            style={styles.logo}
                            src="https://res.cloudinary.com/dkd37ttep/image/upload/v1757258364/kft4hp7sxtym0s7voynl.png"
                        />
                        <Text> Proyecto Sistema Ventas Proformas - Ph0Byte </Text>
                    </View>

                    <View style={styles.invoiceInfo}>
                        <Text style={styles.boldText}>
                            {title}
                        </Text>
                        <Text style={styles.semiBoldText} >
                            Fecha: {formatDate(dataInvoice.createAt)}
                        </Text>
                        <Text style={styles.semiBoldText} >
                            Boleta N°: BLT_{dataInvoice.id}
                        </Text>
                    </View>
                </View>

                {/* Datos del cliente  */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>
                        Cliente:
                    </Text>
                    <Text>
                        Nombre : {dataInvoice.client.fullName}
                    </Text>
                    <Text>
                        DNI: {dataInvoice.client.dni}
                    </Text>
                    <Text>
                        Telefono: {dataInvoice.client.phone}
                    </Text>
                    <Text style={styles.semiBoldText}>
                        {dataInvoice.client.email}
                    </Text>
                </View>

                <View style={styles.section} >
                    <Text style={styles.boldText} > Detalles de la compra: </Text>
                </View>

                {/* Orden de productos */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Producto</Text>
                        <Text style={styles.tableCell}>Cantidad</Text>
                        <Text style={styles.tableCell}>Precio</Text>
                        <Text style={styles.tableCell}>Total</Text>
                    </View>
                    {dataInvoice.orderDetails.map((item) => (
                        <View style={styles.tableRow} key={item.id}>
                            <Text style={styles.tableCell}>
                                {item.product?.name || 'Producto'}
                            </Text>
                            <Text style={styles.tableCell}>
                                {item.quantity}
                            </Text>
                            <Text style={styles.tableCell}>
                                {formatMoney(item.product.price)}
                            </Text>
                            <Text style={styles.tableCell}>
                                {formatMoney(item.product.price * item.quantity)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Subtotal / Tax / Total */}
                <View style={styles.totalSection}>
                    <Text style={styles.boldText}>Resumen: </Text>
                    <Text>Cabtidad de productos: {dataInvoice.count_product} </Text>
                    <Text>Subtotal: {formatMoney(dataInvoice.total)} </Text>
                    <Text>IGV(10%) : {formatMoney(dataInvoice.total*0.10)} </Text>
                    <Text style={styles.totalText}>
                        Total: {formatMoney(dataInvoice.total*1.10)}
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Atendido por : {seller?.name}, {seller?.lastName} </Text>
                    <Text>Direccion: {seller?.storeAddress} </Text>
                    <Text>Telefono: {seller?.carnet} </Text>
                    <Text> *El pago se debe entre los 30 días. Los pagos atrasados están sujetos a tarifas.</Text>
                    <Text> Gracias por su compra! </Text>
                </View>
            </Page>
        </Document>
    );
}
