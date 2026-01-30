import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../home';

describe('CheckoutPage', () => {
  describe('Renderizado inicial', () => {
    test('debe renderizar el componente correctamente', () => {
      render(<Home />);
      
      expect(screen.getByText('Checkout')).toBeInTheDocument();
      expect(screen.getByText('Complete tu reserva de vuelo')).toBeInTheDocument();
      expect(screen.getByText('Código de Cupón')).toBeInTheDocument();
    });

    test('debe mostrar el precio original', () => {
      render(<Home />);
      
      const priceElements = screen.getAllByText('$299.99');
      expect(priceElements.length).toBeGreaterThan(0);
    });

    test('debe mostrar el input de cupón vacío', () => {
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    test('debe mostrar los cupones disponibles', () => {
      render(<Home />);
      
      expect(screen.getByText(/SAVE10/)).toBeInTheDocument();
      expect(screen.getByText(/SAVE20/)).toBeInTheDocument();
      expect(screen.getByText(/SUMMER25/)).toBeInTheDocument();
      expect(screen.getByText(/WELCOME15/)).toBeInTheDocument();
    });

    test('no debe mostrar ningún mensaje de error', () => {
      render(<Home />);
      
      expect(screen.queryByText('Código de cupón inválido')).not.toBeInTheDocument();
      expect(screen.queryByText('Por favor ingresa un código de cupón')).not.toBeInTheDocument();
    });
  });

  describe('Validación de cupones', () => {
    test('debe aplicar correctamente el cupón SAVE10 (10%)', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, 'SAVE10');
      await user.click(button);
      
      expect(screen.getByText('Cupón aplicado: SAVE10')).toBeInTheDocument();
      expect(screen.getByText('Descuento del 10%')).toBeInTheDocument();
      expect(screen.getByText('$269.99')).toBeInTheDocument(); // 299.99 * 0.9
      expect(screen.getByText('Ahorras $30.00')).toBeInTheDocument();
    });

    test('debe aplicar correctamente el cupón SAVE20 (20%)', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, 'SAVE20');
      await user.click(button);
      
      expect(screen.getByText('Cupón aplicado: SAVE20')).toBeInTheDocument();
      expect(screen.getByText('Descuento del 20%')).toBeInTheDocument();
      expect(screen.getByText('$239.99')).toBeInTheDocument(); // 299.99 * 0.8
    });

    test('debe aplicar correctamente el cupón SUMMER25 (25%)', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, 'SUMMER25');
      await user.click(button);
      
      expect(screen.getByText('Cupón aplicado: SUMMER25')).toBeInTheDocument();
      expect(screen.getByText('Descuento del 25%')).toBeInTheDocument();
      expect(screen.getByText('$224.99')).toBeInTheDocument(); // 299.99 * 0.75
    });

    test('debe aplicar correctamente el cupón WELCOME15 (15%)', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, 'WELCOME15');
      await user.click(button);
      
      expect(screen.getByText('Cupón aplicado: WELCOME15')).toBeInTheDocument();
      expect(screen.getByText('Descuento del 15%')).toBeInTheDocument();
      expect(screen.getByText('$254.99')).toBeInTheDocument(); // 299.99 * 0.85
    });

    test('debe mostrar error con cupón inválido', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, 'INVALID');
      await user.click(button);
      
      expect(screen.getByText('Código de cupón inválido')).toBeInTheDocument();
      expect(screen.queryByText(/Cupón aplicado/)).not.toBeInTheDocument();
    });

    test('debe mostrar error con cupón vacío', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const button = screen.getByText('Validar');
      await user.click(button);
      
      expect(screen.getByText('Por favor ingresa un código de cupón')).toBeInTheDocument();
    });

    test('debe ser case-insensitive (minúsculas a mayúsculas)', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, 'save10');
      await user.click(button);
      
      expect(screen.getByText('Cupón aplicado: SAVE10')).toBeInTheDocument();
    });

    test('debe remover espacios en blanco del cupón', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, '  SAVE10  ');
      await user.click(button);
      
      expect(screen.getByText('Cupón aplicado: SAVE10')).toBeInTheDocument();
    });

    test('debe limpiar el input después de aplicar un cupón válido', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      const button = screen.getByText('Validar');
      
      await user.type(input, 'SAVE10');
      await user.click(button);
      
      // El input ya no debería estar visible después de aplicar el cupón
      expect(screen.queryByPlaceholderText('Ingresa tu código')).not.toBeInTheDocument();
    });
  });

  describe('Interacciones del usuario', () => {
    test('debe aplicar cupón al presionar Enter', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      
      await user.type(input, 'SAVE10{Enter}');
      
      expect(screen.getByText('Cupón aplicado: SAVE10')).toBeInTheDocument();
    });

    test('debe permitir escribir en el input', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código') as HTMLInputElement;
      
      await user.type(input, 'TEST123');
      
      expect(input.value).toBe('TEST123');
    });

    test('debe remover el cupón aplicado', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      // Aplicar cupón
      const input = screen.getByPlaceholderText('Ingresa tu código');
      await user.type(input, 'SAVE10{Enter}');
      
      expect(screen.getByText('Cupón aplicado: SAVE10')).toBeInTheDocument();
      
      // Remover cupón
      const removeButton = screen.getByText('Remover');
      await user.click(removeButton);
      
      expect(screen.queryByText('Cupón aplicado: SAVE10')).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ingresa tu código')).toBeInTheDocument();
      // Verificar que el precio volvió al original usando getAllByText
      const prices = screen.getAllByText('$299.99');
      expect(prices.length).toBeGreaterThan(0);
    });

    test('debe limpiar el error al remover el cupón', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      // Intentar aplicar cupón inválido
      const input = screen.getByPlaceholderText('Ingresa tu código');
      await user.type(input, 'INVALID');
      await user.click(screen.getByText('Validar'));
      
      expect(screen.getByText('Código de cupón inválido')).toBeInTheDocument();
      
      // Aplicar cupón válido
      await user.clear(input);
      await user.type(input, 'SAVE10');
      await user.click(screen.getByText('Validar'));
      
      // Remover cupón - el error no debería aparecer
      await user.click(screen.getByText('Remover'));
      
      expect(screen.queryByText('Código de cupón inválido')).not.toBeInTheDocument();
    });
  });

  describe('Cálculos de precio', () => {
    test('debe calcular correctamente el precio con descuento del 10%', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      await user.type(input, 'SAVE10{Enter}');
      
      const expectedPrice = (299.99 * 0.9).toFixed(2);
      expect(screen.getByText(`$${expectedPrice}`)).toBeInTheDocument();
    });

    test('debe calcular correctamente el monto de ahorro', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      await user.type(input, 'SAVE20{Enter}');
      
      const expectedSavings = (299.99 * 0.2).toFixed(2);
      expect(screen.getByText(`Ahorras $${expectedSavings}`)).toBeInTheDocument();
    });

    test('debe mostrar el precio original tachado cuando hay descuento', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      await user.type(input, 'SAVE10{Enter}');
      
      // Buscar el precio original que debería estar tachado
      const strikethroughPrice = screen.getAllByText('$299.99').find(
        el => el.className.includes('line-through')
      );
      expect(strikethroughPrice).toBeInTheDocument();
    });
  });

  describe('UI condicional', () => {
    test('debe mostrar el formulario de cupón cuando no hay cupón aplicado', () => {
      render(<Home />);
      
      expect(screen.getByPlaceholderText('Ingresa tu código')).toBeInTheDocument();
      expect(screen.getByText('Validar')).toBeInTheDocument();
      expect(screen.queryByText('Remover')).not.toBeInTheDocument();
    });

    test('debe mostrar el mensaje de éxito cuando hay cupón aplicado', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      await user.type(input, 'SAVE10{Enter}');
      
      expect(screen.getByText(/Cupón aplicado/)).toBeInTheDocument();
      expect(screen.getByText('Remover')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Ingresa tu código')).not.toBeInTheDocument();
    });

    test('debe ocultar la lista de cupones disponibles cuando hay cupón aplicado', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      await user.type(screen.getByPlaceholderText('Ingresa tu código'), 'SAVE10{Enter}');
      
      expect(screen.queryByText('Cupones disponibles:')).not.toBeInTheDocument();
    });

    test('debe mostrar el badge de ahorro cuando hay cupón aplicado', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      await user.type(screen.getByPlaceholderText('Ingresa tu código'), 'SAVE10{Enter}');
      
      expect(screen.getByText(/Ahorras/)).toBeInTheDocument();
    });
  });

  describe('Botones y enlaces', () => {
    test('debe renderizar el botón de confirmar reserva', () => {
      render(<Home />);
      
      expect(screen.getByText('Confirmar Reserva')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    test('debe tener un heading principal', () => {
      render(<Home />);
      
      const heading = screen.getByRole('heading', { name: 'Checkout', level: 1 });
      expect(heading).toBeInTheDocument();
    });

    test('debe tener inputs accesibles', () => {
      render(<Home />);
      
      const input = screen.getByPlaceholderText('Ingresa tu código');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('debe tener botones accesibles', () => {
      render(<Home />);
      
      const validateButton = screen.getByRole('button', { name: 'Validar' });
      expect(validateButton).toBeInTheDocument();
      
      const confirmButton = screen.getByRole('button', { name: 'Confirmar Reserva' });
      expect(confirmButton).toBeInTheDocument();
    });
  });
});
