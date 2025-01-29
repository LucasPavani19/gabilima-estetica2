document.addEventListener('DOMContentLoaded', function() {
    console.log('Script carregado'); // Debug

    const serviceCards = document.querySelectorAll('.service-card');
    const bookingForm = document.getElementById('bookingForm');
    const selectedServiceSpan = document.getElementById('selectedService');
    const appointmentForm = document.getElementById('appointmentForm');

    console.log('Cards encontrados:', serviceCards.length); // Debug

    // Máscara para o campo de WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        e.target.value = value;
    });

    // Selecionar serviço
    serviceCards.forEach(card => {
        const selectButton = card.querySelector('.select-service');
        console.log('Botão encontrado:', selectButton); // Debug
        
        selectButton.addEventListener('click', () => {
            console.log('Botão clicado');
            
            // Remove seleção anterior
            serviceCards.forEach(c => c.classList.remove('selected'));
            
            // Seleciona o novo card
            card.classList.add('selected');
            
            // Atualiza informações do formulário
            const serviceName = card.getAttribute('data-service');
            const servicePrice = card.getAttribute('data-price');
            selectedServiceSpan.textContent = `${serviceName} - R$ ${servicePrice}`;
            
            // Mostra o formulário
            bookingForm.classList.add('active');
            
            // Scroll suave com offset para melhor visualização
            const offset = 100; // Ajuste esse valor conforme necessário
            const bookingFormTop = bookingForm.offsetTop - offset;
            
            window.scrollTo({
                top: bookingFormTop,
                behavior: 'smooth'
            });
        });
    });

    // Envio do formulário
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const service = selectedServiceSpan.textContent;
        
        // Preparar template para envio do email
        const templateParams = {
            from_name: name,
            service: service,
            whatsapp: whatsapp,
            whatsapp_link: `https://wa.me/55${whatsapp}`, // Link para o WhatsApp do cliente
            to_email: 'lucaspavani132@gmail.com' // Email que receberá as notificações
        };

        // Enviar email
        emailjs.send(
            'service_hcq8kv8', // ID do serviço do EmailJS
            'template_5715lly', // ID do template do EmailJS
            templateParams
        )
        .then(function(response) {
            console.log('Email enviado!', response.status, response.text);
            
            // Abrir WhatsApp do profissional (seu número)
            const message = encodeURIComponent(
                `Olá! Gostaria de agendar um horário.\n\n` +
                `Nome: ${name}\n` +
                `Tratamento: ${service}\n`
            );
            
            // Aqui você coloca o SEU número de WhatsApp
            window.open(`https://wa.me/5521981560767?text=${message}`);
            
            // Limpar formulário e estado
            appointmentForm.reset();
            bookingForm.classList.remove('active');
            serviceCards.forEach(c => c.classList.remove('selected'));
            
            // Mostrar mensagem de sucesso
            alert('Solicitação enviada com sucesso!');
        })
        .catch(function(error) {
            console.log('Erro ao enviar email:', error);
            alert('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.');
        });
    });
}); 