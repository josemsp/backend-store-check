interface InvitationEmailProps {
    actionLink: string;
    roleName: string;
}

export function InvitationEmail({ actionLink, roleName }: InvitationEmailProps) {
    return (
        <div>
            <h2>Has sido invitado</h2>
            <p>Te han invitado como <b>{roleName}</b>.</p>
            <p>
                <a href={actionLink}
                    style={{
                        padding: '10px 16px',
                        background: '#2563eb',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '6px'
                    }}>
                    Aceptar invitación
                </a>
            </p>
        </div>
    );
}
