package medicod.notifications;

public class EmailTemplates {

    public static String reminderEmail(String username, String medName, String time) {
        return """
                <h2>Recordatorio de Medicación</h2>
                <p>Hola %s,</p>
                <p>Es hora de tomar tu medicamento <b>%s</b>.</p>
                <p>Hora del recordatorio: <b>%s</b></p>
                <br/>
                <p>Por favor no ignores este aviso.</p>
                """.formatted(username, medName, time);
    }

    public static String lowStockEmail(String username, String medName, int qty) {
        return """
            <h2>Advertencia: Pocas Unidades</h2>
            <p>Hola %s,</p>
            <p>El medicamento <b>%s</b> está quedándose sin unidades.</p>
            <p>Unidades restantes: <b>%d</b></p>
            <p>Por favor repón este medicamento pronto.</p>
            """.formatted(username, medName, qty);
    }

    public static String expiredEmail(String username, String medName) {
        return """
            <h2>Medicamento Vencido</h2>
            <p>Hola %s,</p>
            <p>El medicamento <b>%s</b> ya está vencido.</p>
            <p>No lo consumas y reemplázalo cuanto antes.</p>
            """.formatted(username, medName);
    }

    public static String expiringSoonEmail(String username, String medName, String expirationDate) {
        return """
            <h2>Medicamento Próximo a Vencer</h2>
            <p>Hola %s,</p>
            <p>El medicamento <b>%s</b> está por vencer.</p>
            <p>Fecha de vencimiento: <b>%s</b></p>
            <p>Por favor planea reemplazarlo.</p>
            """.formatted(username, medName, expirationDate);
    }

    public static String outOfStockEmail(String username, String medName) {
        return """
            <h2>Medicamento Agotado</h2>
            <p>Hola %s,</p>
            <p>Ya no tienes unidades de <b>%s</b>.</p>
            <p>Reabastece este medicamento lo antes posible.</p>
            """.formatted(username, medName);
    }

}
