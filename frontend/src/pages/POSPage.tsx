import React from 'react'

const POSPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Punto de Venta (POS)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Productos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Productos de ejemplo */}
              <div className="border border-gray-200 p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-medium">Café Americano</h3>
                <p className="text-coffee-600 font-bold">$25.00</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-medium">Café Latte</h3>
                <p className="text-coffee-600 font-bold">$35.00</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-medium">Croissant</h3>
                <p className="text-coffee-600 font-bold">$20.00</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Carrito</h2>
            <div className="text-center text-gray-500 py-8">
              <p>No hay productos en el carrito</p>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>$0.00</span>
              </div>
              <button className="w-full bg-coffee-600 text-white py-2 rounded-lg mt-4 hover:bg-coffee-700 transition-colors">
                Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSPage