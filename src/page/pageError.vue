<template>
	<Box>
		<div style="width: 500px; height:30px; margin-top: 100px; margin-left: 100px;">
			抱歉！您的页面发生了未知错误！
		</div>
		<div style="width: 800px; height:500px; margin-top: 10px; margin-left: 100px;">
			异常信息：<br/>
			2019-05-10 15:11:57 -20778215 [http-nio-8080-exec-3] DEBUG   - {conn-10006} setAutoCommit false
			2019-05-10 15:11:57 -20778215 [http-nio-8080-exec-11] DEBUG   - {conn-10001} setAutoCommit false
			2019-05-10 15:11:57 -20778216 [http-nio-8080-exec-5] DEBUG   - {conn-10002} setAutoCommit false
			15:11:57.437 [http-nio-8080-exec-3] DEBUG org.mybatis.spring.SqlSessionUtils - Creating a new SqlSession
			15:11:57.437 [http-nio-8080-exec-3] DEBUG org.mybatis.spring.SqlSessionUtils - Registering transaction synchronization for SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@2cc6a19a]
			15:11:57.437 [http-nio-8080-exec-3] DEBUG o.m.s.t.SpringManagedTransaction - JDBC Connection [com.alibaba.druid.proxy.jdbc.ConnectionProxyImpl@42936285] will be managed by Spring
			15:11:57.437 [http-nio-8080-exec-3] DEBUG S.getAllSystemLanguageList - ==>  Preparing: SELECT system_language.id, system_language.language_code, system_language.language_name, system_language.language_icon, system_language.is_default, system_language.enable, system_language.order_mark, system_language.description, system_language.create_by, system_language.create_time, system_language.last_modify_time, system_language.last_modify_by FROM system_language WHERE 1=1 and system_language.enable = ? order by system_language.order_mark asc
			15:11:57.437 [http-nio-8080-exec-3] DEBUG S.getAllSystemLanguageList - ==> Parameters: true(Boolean)
			2019-05-10 15:11:57 -20778217 [http-nio-8080-exec-3] DEBUG   - {conn-10006, pstmt-20230} Parameters : [true]
			2019-05-10 15:11:57 -20778217 [http-nio-8080-exec-3] DEBUG   - {conn-10006, pstmt-20230} Types : [BOOLEAN]
			2019-05-10 15:11:57 -20778218 [http-nio-8080-exec-11] DEBUG   - Opening RedisConnection
			15:11:57.438 [http-nio-8080-exec-5] DEBUG org.mybatis.spring.SqlSessionUtils - Creating a new SqlSession
		</div>
	</Box>
</template>

<script>
	export default {
		name: "PageError"
	}
</script>

<style scoped>

</style>
