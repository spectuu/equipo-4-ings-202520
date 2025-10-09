package medicod.domain.service.auth;

import com.medicod.database.tables.records.MedicodUsersRecord;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import medicod.configuration.mapper.UserMapper;
import org.jooq.types.ULong;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = "8c2ae402503b43e4311bf05907bde8b0f60599fcd72cd45189f0f487723e212c5e389ce200de6348e162390fb151de5a8cd55be306aef0a0464fd10e0a189d2a447f78eaf0627afd5075c84c6f291916f13d2903236a48359be8cb5167eac099b5c10074e7837595c6e8585c5249198f8a9ea1222e01baa1538c47fed05220b3afcc235b0f19874dc292283ce4615656c6deb360e3f883ccf8880497e3e3fa6482d82465e6eba1bfae18b126243f2eec177e12eff88aa74b6ecfb9d4740e6bba8a0a854e9a2fb1ec7bb5371fe8576c0c2a36fa21824eeea8ddce9ce882b53c3dcf5099560400b687a6c4635c6cff3e08a4e7902da8c24c3fc938fdf85c8b6ecd0d9e18b33a24d110cb5239c9fd18a437d58435d14c09dd697fe3fee21314bd2c17d23ab52810019535938f8a0ae334151f98f88d8d2af8c04fd398200b775341881f6535fc88171da1a046af6dee5eec5f2050482ee34289a4f10f8f4d8118c1cceb3e84a80ae01f70833a168175671aa7612a36a238021c67aec7993678decb5c3ed88f3db18628cbb85118a2a52f3db2ac658826dd55c593f676585ad9502c1feff03ac05e3a5cabfb3fb7fb02d7848c4d521212f060dfdee8c403d2deb2a05578d2ee6106b4cc626ade410edf0f692863921b6f3cc17fe41b5a405f84f04c04309af75dbc29792afd191ab6b882a572dff17f155559796600b1850f8a6253";

   public String getToken(MedicodUsersRecord account){
        return getToken(new HashMap<>(), account);
    }

    private String getToken(HashMap<String, Object> claims, MedicodUsersRecord account){
        return Jwts.builder()
                .claims(claims)
                .subject(account.getName())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                .signWith(getKey())
                .compact();
    }

    public Key getKey() {
        byte[] keyBytes = hexStringToByteArray(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }

    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && isTokenExpired(token));
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public ULong getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.isAuthenticated()){
            UserMapper userDetails = (UserMapper) authentication.getPrincipal();
            return userDetails.getId();
        }

        return ULong.valueOf(-1L);
    }

    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return !getExpiration(token).before(new Date());
    }


}
