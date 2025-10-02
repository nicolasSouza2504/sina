package senai.com.ava_senai.handler.requesthandler.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import senai.com.ava_senai.domain.user.UserResponseDTO;
import senai.com.ava_senai.handler.requesthandler.security.user.AuthyUserDetails;
import senai.com.ava_senai.services.user.UserService;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    private final UserService userService;
    @Value("${auth.token.jwtSecret}")
    private String jwtSecret;

    @Value("${auth.token.expirationInMils}")
    private int expirationTime;

    public JwtUtils(UserService userService) {
        this.userService = userService;
    }

    public String generateTokenForUser(Authentication authentication) {

        AuthyUserDetails userPrincipal = (AuthyUserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .claim("id", userPrincipal.getId())
                .claim("idEntity", userPrincipal.getIdInstitution())
                .claim("role", userPrincipal.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining("")))
                .claim("user", new UserResponseDTO(
                        userPrincipal.getId(),
                        userPrincipal.getEmail(),
                        userPrincipal.getName(),
                        userPrincipal.getRole(),
                        userPrincipal.getInstitution().getInstitutionName(),
                        userPrincipal.getCpf(),
                        userPrincipal.getUserImage())
                )
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expirationTime))
                .signWith(key(), SignatureAlgorithm.HS256).compact();

    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    public Long getIDInstitutionFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("idInstitution", Long.class);
    }


    public boolean validateToken(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException |
                 IllegalArgumentException e) {
            throw new JwtException(e.getMessage());
        }

    }

}
