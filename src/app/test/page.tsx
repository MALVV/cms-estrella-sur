export default function TestPage() {
  return (
    <div className="bg-red-500 text-white p-8">
      <h1 className="text-4xl font-bold">Prueba de TailwindCSS</h1>
      <p className="text-xl mt-4">Si ves este texto en rojo con fondo rojo, TailwindCSS está funcionando.</p>
      <div className="bg-blue-500 text-white p-4 mt-4 rounded-lg">
        <p>Este es un div azul con bordes redondeados.</p>
      </div>
    </div>
  );
}
