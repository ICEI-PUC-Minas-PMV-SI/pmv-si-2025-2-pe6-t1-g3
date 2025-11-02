export default {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'auto'
    }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    // Transforma import.meta.env em process.env para testes
    function({ types: t }) {
      return {
        visitor: {
          MetaProperty(path) {
            if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
              // Substitui import.meta por um objeto { env: process.env }
              path.replaceWith(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('env'),
                    t.memberExpression(
                      t.identifier('process'),
                      t.identifier('env')
                    )
                  )
                ])
              );
            }
          }
        }
      };
    }
  ]
};
