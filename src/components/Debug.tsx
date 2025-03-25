'use client';

export default function Debug() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <h2 className="text-xl font-bold mb-2">Debug Info:</h2>
      <div>
        <p>Tela de debug para identificar problemas</p>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-2"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Limpar Cache e Recarregar
        </button>
      </div>
    </div>
  );
} 