package medicod.utils;

import lombok.experimental.UtilityClass;
import medicod.domain.dto.MapResponse;
import org.jooq.Record;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

@UtilityClass
public class MapUtil {

    public static <T extends Record> List<MapResponse> mapRecords(List<T> records, BiConsumer<T, Map<String, Object>> mapperFunction) {
        return records.stream()
                .map(record -> {
                    Map<String, Object> map = new HashMap<>();
                    mapperFunction.accept(record, map);
                    return new MapResponse(map);
                })
                .collect(Collectors.toList());
    }

    public static <T extends Record> MapResponse mapRecord(T record, BiConsumer<T, Map<String, Object>> mapperFunction) {
        Map<String, Object> map = new HashMap<>();
        mapperFunction.accept(record, map);
        return new MapResponse(map);
    }

}
