import React from 'react'
import { SalesReport as SalesReportType } from '../../types/sales'

interface SalesReportProps {
  report: SalesReportType
  loading?: boolean
}

const SalesReport: React.FC<SalesReportProps> = ({ report, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reporte de Ventas</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Reporte de Ventas</h2>
      
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Total de Ventas</p>
          <p className="text-2xl font-bold text-coffee-600">{report.totalSales}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Ingresos Totales</p>
          <p className="text-2xl font-bold text-green-600">${report.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Artículos Vendidos</p>
          <p className="text-2xl font-bold text-blue-600">{report.totalItems}</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Ticket Promedio</p>
          <p className="text-2xl font-bold text-purple-600">${report.averageTicket.toFixed(2)}</p>
        </div>
      </div>

      {/* Ventas por método de pago */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Ventas por Método de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {report.salesByPaymentMethod.map((method) => (
            <div key={method.method} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 capitalize">{method.method.toLowerCase()}</p>
              <p className="text-lg font-semibold">{method.count} ventas</p>
              <p className="text-sm text-gray-500">${method.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Productos Más Vendidos</h3>
        <div className="space-y-2">
          {report.topProducts.slice(0, 5).map((product, index) => (
            <div key={product.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm text-gray-500 mr-2">#{index + 1}</span>
                <span className="font-medium">{product.productName}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{product.quantity} unidades</p>
                <p className="text-xs text-gray-500">${product.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ventas por fecha */}
      {report.salesByDate.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Ventas por Fecha</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Ventas
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Ingresos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.salesByDate.slice(-7).map((dateSale) => (
                  <tr key={dateSale.date}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {new Date(dateSale.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {dateSale.sales}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      ${dateSale.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesReport