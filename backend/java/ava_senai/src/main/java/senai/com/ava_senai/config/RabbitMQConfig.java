package senai.com.ava_senai.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange names
    public static final String EXCHANGE_TASKS = "ava.tasks";
    public static final String EXCHANGE_NOTIFICATIONS = "ava.notifications";

    // Queue names
    public static final String QUEUE_USER_TASKS = "user-tasks-queue";

    // Routing keys
    public static final String ROUTING_CREATE_USER_TASK = "task.create.user";


    @Bean
    public DirectExchange taskExchange() {
        return new DirectExchange(EXCHANGE_TASKS);
    }

    @Bean
    public DirectExchange notificationExchange() {
        return new DirectExchange(EXCHANGE_NOTIFICATIONS);
    }

    @Bean
    public Queue userTasksQueue() {
        return new Queue(QUEUE_USER_TASKS, true);
    }

    @Bean
    public Binding taskCreationBinding(Queue userTasksQueue, DirectExchange taskExchange) {
        return BindingBuilder
                .bind(userTasksQueue)
                .to(taskExchange)
                .with(ROUTING_CREATE_USER_TASK);
    }

     @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
