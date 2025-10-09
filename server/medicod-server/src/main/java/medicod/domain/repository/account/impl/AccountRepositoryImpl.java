package medicod.domain.repository.account.impl;

import com.medicod.database.tables.records.MedicodUsersRecord;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import medicod.domain.repository.account.AccountRepository;
import org.jooq.DSLContext;
import org.jooq.types.ULong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.medicod.database.Tables.MEDICOD_USERS;

@RequiredArgsConstructor
@Transactional
@Repository
public class AccountRepositoryImpl implements AccountRepository {

    @Autowired
    private final DSLContext context;

    @Override
    public List<MedicodUsersRecord> getAllAccounts() {
        return context.selectFrom(MEDICOD_USERS).fetch();
    }

    @Override
    public List<MedicodUsersRecord> getPageOfAccounts(int page, int size) {
        return context.selectFrom(MEDICOD_USERS)
                .limit(size)
                .offset(page * size)
                .fetch();
    }

    @Override
    public MedicodUsersRecord getAccountById(long id) {
        return context.select()
                .from(MEDICOD_USERS)
                .where(MEDICOD_USERS.ID.eq(ULong.valueOf(id)))
                .fetchOneInto(MedicodUsersRecord.class);
    }

    @Override
    public MedicodUsersRecord getAccountByUsername(String username) {
        return context.select()
                .from(MEDICOD_USERS)
                .where(MEDICOD_USERS.NAME.eq(username))
                .fetchOneInto(MedicodUsersRecord.class);
    }

    @Override
    public MedicodUsersRecord getAccountByEmailOrUsername(String email, String username) {
        return context.selectFrom(MEDICOD_USERS)
                .where(MEDICOD_USERS.EMAIL.eq(email).or(MEDICOD_USERS.NAME.eq(username)))
                .fetchOne();
    }

    @Override
    public MedicodUsersRecord getAccountByEmail(String email) {
        return context.select()
                .from(MEDICOD_USERS)
                .where(MEDICOD_USERS.EMAIL.eq(email))
                .fetchOneInto(MedicodUsersRecord.class);
    }

    @Override
    public void save(MedicodUsersRecord account) {
        context.insertInto(MEDICOD_USERS)
                .set(account)
                .execute();
    }


}
